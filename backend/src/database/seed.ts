import { existsSync, readdirSync, readFileSync } from 'fs';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ProfileSchema } from '../profile/schemas/profile.schema';
import { ProfileLinkSchema } from '../profile/schemas/profile-link.schema';
import { SkillSchema } from '../skills/schemas/skill.schema';
import { ProjectSchema } from '../projects/schemas/project.schema';
import { ExperienceSchema } from '../experience/schemas/experience.schema';
import { ContactMessageSchema } from '../contact/schemas/contact-message.schema';
import { SkillCategory, SkillLevel } from '../common/enums/skill.enums';
import { ProjectStatus } from '../common/enums/project.enums';

dotenv.config();

const CV_DIR = join(__dirname, '..', '..', '..', 'cv');

const ProfileModel = mongoose.model('Profile', ProfileSchema);
const ProfileLinkModel = mongoose.model('ProfileLink', ProfileLinkSchema);
const SkillModel = mongoose.model('Skill', SkillSchema);
const ProjectModel = mongoose.model('Project', ProjectSchema);
const ExperienceModel = mongoose.model('Experience', ExperienceSchema);
const ContactMessageModel = mongoose.model('ContactMessage', ContactMessageSchema);

/**
 * If a PDF sits in cv/, upload it to S3/MinIO and return its public URL for
 * Profile.resumeUrl. Requires S3_* env vars — see .env.example. Never throws for a
 * missing CV; that's the expected state until one is dropped in.
 */
async function uploadResumeIfPresent(): Promise<string | undefined> {
  if (!existsSync(CV_DIR)) return undefined;
  const pdf = readdirSync(CV_DIR).find((f) => extname(f).toLowerCase() === '.pdf');
  if (!pdf) return undefined;

  const bucket = process.env.S3_BUCKET;
  const endpoint = process.env.S3_ENDPOINT;
  const publicUrl = process.env.S3_PUBLIC_URL;
  if (!bucket || !endpoint || !publicUrl) {
    console.warn(`Found ${pdf} but S3_* env vars are not set — skipping resume upload.`);
    return undefined;
  }

  const client = new S3Client({
    region: process.env.S3_REGION ?? 'us-east-1',
    endpoint,
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
    },
  });

  const key = `resumes/${randomUUID()}.pdf`;
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: readFileSync(join(CV_DIR, pdf)),
      ContentType: 'application/pdf',
    }),
  );

  const url = `${publicUrl.replace(/\/$/, '')}/${key}`;
  console.log(`Uploaded ${pdf} -> ${url}`);
  return url;
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI ?? '');

  const resumeUrl = await uploadResumeIfPresent();

  await Promise.all([
    ContactMessageModel.deleteMany({}),
    ExperienceModel.deleteMany({}),
    ProjectModel.deleteMany({}),
    SkillModel.deleteMany({}),
    ProfileLinkModel.deleteMany({}),
    ProfileModel.deleteMany({}),
  ]);

  const profile = await ProfileModel.create({
    fullName: 'Ilyas Aitkazin',
    title: 'Full-Stack Developer',
    bio: 'Full-Stack Developer with 4 years of production experience building web applications. Core production stack: JavaScript/TypeScript, Node.js, GraphQL, MongoDB, and Svelte. Promoted from Junior to Middle+ over four years at Strana Development, owning features end-to-end, working from problem statements rather than full specs, and contributing to system architecture decisions. Also builds with React and React Native on personal projects. Domain background in proptech and real estate, looking to apply it on an international team.',
    email: 'ilyas.aitkazin@gmail.com',
    phone: '+7 707 911 0441',
    location: 'Astana, Kazakhstan',
    resumeUrl,
    languages: [
      'Russian (native)',
      'Kazakh (native)',
      'English (full professional)',
      'Turkish (professional working)',
    ],
    certifications: [
      'Object-Oriented Design – University of Alberta, via Coursera (2021)',
      'Design Patterns – University of Alberta, via Coursera (2021)',
    ],
  });

  const profileId = profile.id as string;

  await Promise.all([
    ProfileLinkModel.insertMany([
      { label: 'GitHub', url: 'https://github.com/aitkazeen', profileId },
      { label: 'LinkedIn', url: 'https://linkedin.com/in/ilyas-aitkazin', profileId },
    ]),
    SkillModel.insertMany(
      [
        // Core production stack (per CV)
        { name: 'JavaScript', category: SkillCategory.LANGUAGE, level: SkillLevel.EXPERT },
        { name: 'TypeScript', category: SkillCategory.LANGUAGE, level: SkillLevel.EXPERT },
        { name: 'Node.js', category: SkillCategory.RUNTIME, level: SkillLevel.EXPERT },
        { name: 'GraphQL', category: SkillCategory.FRAMEWORK, level: SkillLevel.EXPERT },
        { name: 'MongoDB', category: SkillCategory.DATABASE, level: SkillLevel.EXPERT },
        { name: 'Svelte', category: SkillCategory.FRAMEWORK, level: SkillLevel.EXPERT },
        // Frontend, personal-project depth
        { name: 'React', category: SkillCategory.FRAMEWORK, level: SkillLevel.FAMILIAR },
        { name: 'React Native', category: SkillCategory.FRAMEWORK, level: SkillLevel.FAMILIAR },
        { name: 'HTML5', category: SkillCategory.LANGUAGE, level: SkillLevel.PROFICIENT },
        { name: 'CSS3', category: SkillCategory.LANGUAGE, level: SkillLevel.PROFICIENT },
        // Backend
        { name: 'REST APIs', category: SkillCategory.TOOLING, level: SkillLevel.PROFICIENT },
        { name: 'PostgreSQL', category: SkillCategory.DATABASE, level: SkillLevel.PROFICIENT },
        { name: 'Prisma', category: SkillCategory.DATABASE, level: SkillLevel.PROFICIENT },
        { name: 'CockroachDB', category: SkillCategory.DATABASE, level: SkillLevel.FAMILIAR },
        { name: 'NestJS', category: SkillCategory.FRAMEWORK, level: SkillLevel.PROFICIENT },
        // Data & automation
        { name: 'Apache Airflow', category: SkillCategory.TOOLING, level: SkillLevel.PROFICIENT },
        { name: 'Apache Kafka', category: SkillCategory.TOOLING, level: SkillLevel.PROFICIENT },
        { name: 'Camunda/BPMN', category: SkillCategory.TOOLING, level: SkillLevel.PROFICIENT },
        // DevOps & tools
        { name: 'Docker', category: SkillCategory.DEVOPS, level: SkillLevel.PROFICIENT },
        { name: 'CI/CD', category: SkillCategory.DEVOPS, level: SkillLevel.PROFICIENT },
        { name: 'Git', category: SkillCategory.TOOLING, level: SkillLevel.EXPERT },
        { name: 'Budibase', category: SkillCategory.TOOLING, level: SkillLevel.FAMILIAR },
        { name: 'Claude Code', category: SkillCategory.TOOLING, level: SkillLevel.PROFICIENT },
      ].map((skill) => ({ ...skill, profileId })),
    ),
    ProjectModel.insertMany(
      [
        {
          title: 'Digital Business Card API',
          description:
            'This project: a NestJS + GraphQL + Mongoose monolith serving a developer profile as a queryable API, backed by MongoDB, with file uploads to S3-compatible storage (MinIO), containerized with Docker.',
          techStack: ['TypeScript', 'NestJS', 'GraphQL', 'Mongoose', 'MongoDB', 'Docker', 'S3 (MinIO)'],
          featured: true,
          status: ProjectStatus.ONGOING,
        },
        {
          title: 'KursWise (dfta)',
          description:
            'Mobile financial assistant that analyzes USD/EUR/RUB → KZT currency pairs via technical indicators (EMA, RSI, MACD, Stochastic, ATR, Bollinger Bands) and news sentiment to forecast price direction, delivering push notifications. Quotes from the National Bank of Kazakhstan with a ForexRateAPI fallback; a BullMQ worker polls every 6 hours; optional LLM (Gemini/Anthropic) integration explains forecasts in plain language.',
          techStack: ['React Native', 'Expo', 'Fastify', 'BullMQ', 'PostgreSQL', 'TimescaleDB', 'Redis', 'Docker'],
          repoUrl: 'https://github.com/aitkazeen/dfta',
          featured: false,
          // No reliable signal of completion state from the repo — left unset (see
          // schema comment) rather than guessed, per the "never invent" CV rule.
        },
        {
          title: 'GC App — Mobile Frontend',
          description:
            'React Native + Expo mobile frontend built on a forked starter (Ammite/gcapp_front_) and extended with tab navigation, geolocation, chart-based data views (react-native-chart-kit), secure token storage, and an Axios-backed API layer.',
          techStack: ['React Native', 'Expo', 'TypeScript', 'React Navigation', 'Axios'],
          repoUrl: 'https://github.com/aitkazeen/gcapp_front',
          featured: false,
        },
      ].map((project) => ({ ...project, profileId })),
    ),
    ExperienceModel.insertMany(
      [
        {
          role: 'Middle+ Full-Stack Developer',
          company: 'Strana Development',
          startDate: new Date('2022-01-01'),
          endDate: new Date('2026-07-22'),
          description:
            'Promoted from Junior to Middle+ over four years for consistent feature delivery and growing technical ownership. Built and maintained platform-wide frontend tools, including a calendar component used daily by around 2,000 people across contractors, site supervisors, and project managers, and a hierarchical estimate tree showing work types, responsible parties, volumes, and formulas. Led MongoDB aggregation pipeline tuning, bringing average query response times for reporting endpoints under 100ms, used daily for quarterly contractor KPI calculations. Automated six business processes in Camunda BPMN, wiring them into a microservice maintained end-to-end. Designed new system components and contributed to technical strategy, including offline mode support for business processes on unreliable connectivity. Built data pipelines with Apache Airflow (Python) and event-streaming services with Apache Kafka (Python and JavaScript) for cross-service communication. Containerized services with Docker and maintained CI/CD pipelines, cutting deployment time by roughly 20%. Onboarded new developers and took on tasks without a full technical brief.',
        },
        {
          role: 'Intern QA Developer',
          company: 'BI Group',
          startDate: new Date('2022-03-01'),
          endDate: new Date('2022-07-01'),
          description:
            'Wrote end-to-end test automation scripts with Puppeteer, improving coverage of critical user flows. Contributed to the internal test automation framework. Wrote clean, well-structured JavaScript code reviewed by senior engineers.',
        },
      ].map((experience) => ({ ...experience, profileId })),
    ),
  ]);

  console.log(`Seeded profile ${profileId} (${profile.fullName})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
