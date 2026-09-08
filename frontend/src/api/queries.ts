export const PROFILE_QUERY = `
  query Profile {
    profile {
      fullName
      title
      bio
      email
      location
      avatarUrl
      resumeUrl
      links { label url }
      skills { name category level }
      projects { title description techStack imageUrl repoUrl liveUrl featured status }
      experience { role company startDate endDate description }
    }
  }
`;
