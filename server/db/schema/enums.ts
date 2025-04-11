import { pgEnum } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";

// Enums for Order Status and other fixed value fields
export const userRoleEnum = pgEnum("user_role", [
  "PROJECT MANAGER",
  "ASSOCIATE",
  "ADMIN",
  "CANDIDATE",
]);
export const candidateStatusEnum = pgEnum("candidate_status", [
  "NEW",
  "PRE_ASSESSMENT_PENDING",
  "PRE_ASSESSMENT_COMPLETED",
  "ASSESSMENT_PASSED",
  "ASSESSMENT_FAILED",
  "GROOMING_IN_PROGRESS",
  "GROOMING_COMPLETED",
  "POST_ASSESSMENT_PENDING",
  "POST_ASSESSMENT_COMPLETED",
  "CLIENT_INTERVIEW_SCHEDULED", // Kept as PM might manually set this
  "CLIENT_INTERVIEW_FAILED",
  "RE_GROOMING_SCHEDULED",
  "PLACED",
  "TERMINATED",
]);

export const assessmentTypeEnum = pgEnum("assessment_type", ["PRE_ASSESSMENT", "POST_ASSESSMENT"]);

export const assessmentOutcomeEnum = pgEnum("assessment_outcome", ["PASS", "FAIL"]);

//  Select Schemas
export const userRoleSchema = createSelectSchema(userRoleEnum);
export const candidateStatusSchema = createSelectSchema(candidateStatusEnum);
export const assessmentTypeSchema = createSelectSchema(assessmentTypeEnum);
export const assessmentOutcomeSchema = createSelectSchema(assessmentOutcomeEnum);
