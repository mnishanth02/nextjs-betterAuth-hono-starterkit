import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { AdapterAccountType } from "next-auth/adapters";
import { userRoleEnum } from "./enums";
import { candidates, teams, topics } from "./grooming";
// ----------------------- USERS & AUTHENTICATION -----------------------
//  users or Associates
export const users = pgTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").notNull(),
    image: text("image"),
    hashedPassword: text("hashed_password"),
    teamId: text("team_id").references(() => teams.id, { onDelete: "set null" }),
    emailVerified: timestamp("email_verified", { mode: "date" }),
    phoneNumber: text("phone_number"),
    role: userRoleEnum("user_role").default("CANDIDATE").notNull(),
    isActive: boolean("is_active").default(false).notNull(),
    designation: text("designation"),
    department: text("department"),
    employeeId: text("employee_id"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
    deletedAt: timestamp("deleted_at", { mode: "date" }), // For soft delete
  },
  (table) => [
    index("users_name_idx").on(table.name),
    uniqueIndex("users_email_idx").on(table.email),
    index("users_role_idx").on(table.role),
    index("users_team_id_idx").on(table.teamId),
  ]
);

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

// Audit log for user actions
export const userAuditLogs = pgTable(
  "user_audit_logs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    action: varchar("action", { length: 255 }).notNull(),
    details: jsonb("details"),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("user_audit_logs_user_id_idx").on(table.userId),
    index("user_audit_logs_action_idx").on(table.action),
    index("user_audit_logs_created_at_idx").on(table.createdAt),
  ]
);

export const associateSkills = pgTable(
  "associate_skills",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    associateId: text("associate_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    skillId: text("skill_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    proficiencyLevel: integer("proficiency_level"), // 1-5
  },
  (table) => [uniqueIndex("associate_skill_unique").on(table.associateId, table.skillId)]
);

/*******************************************
 ************** Relations *****************
 *******************************************
 */

export const associateSkillsRelations = relations(associateSkills, ({ one }) => ({
  associate: one(users, {
    fields: [associateSkills.associateId],
    references: [users.id],
    relationName: "AssociateSkills",
  }),
  skill: one(topics, {
    fields: [associateSkills.skillId],
    references: [topics.id],
  }),
}));

// Relations for users
export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  team: one(teams, {
    fields: [users.teamId],
    references: [teams.id],
  }),
  associateSkills: many(associateSkills, {
    relationName: "AssociateSkills",
  }),
  candidatesAssignedAsAssessor: many(candidates, { relationName: "AssessorCandidates" }),
  candidatesAssignedAsGroomer: many(candidates, { relationName: "GroomerCandidates" }),
}));

// Relations for accounts
export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

// Relations for userAuditLogs
export const userAuditLogsRelations = relations(userAuditLogs, ({ one }) => ({
  user: one(users, {
    fields: [userAuditLogs.userId],
    references: [users.id],
  }),
}));

/*******************************************
 ************** Select SChema **************
 *******************************************
 */

export const usersSchema = createSelectSchema(users);
export const userAuditLogsSchema = createSelectSchema(userAuditLogs);
export const associateSkillsSchema = createSelectSchema(associateSkills);

/************** Insert SChema ****************/

export const usersInsertSchema = createInsertSchema(users);
export const userAuditLogsInsertSchema = createInsertSchema(userAuditLogs);
export const associateSkillsInsertSchema = createInsertSchema(associateSkills);

//  Types
export type UserType = typeof users.$inferSelect;
export type AssociateSkillsType = typeof associateSkills.$inferSelect;
