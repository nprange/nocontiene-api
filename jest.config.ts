import dotenv from 'dotenv';
dotenv.config({ path: '.env.development' });

import type { Config } from '@jest/types';

const jestConfig: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', '<rootDir>'],
  testTimeout: 60000,
};

export default jestConfig;
