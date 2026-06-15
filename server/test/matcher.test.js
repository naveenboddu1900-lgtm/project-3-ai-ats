import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeCandidate } from '../src/services/aiMatcher.js';

test('analyzeCandidate scores skill overlap against the job description', async () => {
  const result = await analyzeCandidate({
    job: {
      title: 'React Engineer',
      skills: ['React', 'JavaScript', 'REST APIs', 'Material UI']
    },
    resumeText: 'React JavaScript Material UI REST APIs dashboards with 5 years experience',
    coverLetter: ''
  });

  assert.equal(result.matchScore, 95);
  assert.deepEqual(result.skills, ['React', 'JavaScript', 'Material UI', 'REST APIs']);
  assert.equal(result.experienceYears, 5);
});
