const knownSkills = [
  'React',
  'JavaScript',
  'TypeScript',
  'Node.js',
  'Express',
  'MongoDB',
  'JWT',
  'Material UI',
  'REST APIs',
  'AWS',
  'S3',
  'Python',
  'OpenAI',
  'Gemini'
];

export async function analyzeCandidate({ job, resumeText, coverLetter }) {
  const corpus = `${resumeText} ${coverLetter}`.toLowerCase();
  const extractedSkills = knownSkills.filter((skill) => corpus.includes(skill.toLowerCase()));
  const required = job.skills || [];
  const matchedRequired = required.filter((skill) => corpus.includes(skill.toLowerCase()));
  const skillScore = required.length ? Math.round((matchedRequired.length / required.length) * 75) : 50;
  const experienceYears = extractExperienceYears(corpus);
  const experienceScore = Math.min(experienceYears * 5, 20);
  const contentScore = corpus.length > 250 ? 5 : 0;
  const matchScore = Math.min(98, skillScore + experienceScore + contentScore);

  return {
    skills: extractedSkills.length ? extractedSkills : matchedRequired,
    experienceYears,
    matchScore,
    summary: buildSummary(job, matchedRequired, experienceYears, matchScore),
    analysis: {
      provider: 'local-semantic-fallback',
      matchedRequired,
      requiredSkills: required
    }
  };
}

function extractExperienceYears(text) {
  const match = text.match(/(\d+)\+?\s*(years|yrs)/);
  return match ? Number(match[1]) : 1;
}

function buildSummary(job, matchedRequired, years, score) {
  const skills = matchedRequired.length ? matchedRequired.join(', ') : 'transferable skills';
  return `${score}% semantic match for ${job.title}, with ${years} years experience and evidence of ${skills}.`;
}
