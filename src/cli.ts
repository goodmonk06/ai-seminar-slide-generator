#!/usr/bin/env node
/**
 * AI Seminar Slide Generator CLI
 * Interactive command-line tool for common development tasks
 */

import { createInterface } from "readline";
import { getAllSlidePlans, getSlidePlan } from "../lib/storage";
import { getAllTemplates } from "../lib/storage/templates";
import { getAllPresentations } from "../lib/storage/presentations";
import { getAvailableProviders } from "../lib/providers/factory";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function showMenu() {
  console.log("\n===========================================");
  console.log("  AI Seminar Slide Generator CLI");
  console.log("===========================================\n");
  console.log("1. List all slide plans");
  console.log("2. View slide plan details");
  console.log("3. List all templates");
  console.log("4. List all presentations");
  console.log("5. Check AI provider status");
  console.log("6. Show statistics");
  console.log("0. Exit\n");
}

async function listPlans() {
  const result = await getAllSlidePlans();

  if (result.items.length === 0) {
    console.log("\nNo slide plans found.");
    return;
  }

  console.log(`\nFound ${result.total} slide plan(s):\n`);
  result.items.forEach((plan, index) => {
    console.log(`${index + 1}. ${plan.title}`);
    console.log(`   ID: ${plan.id}`);
    console.log(`   Audience: ${plan.audience}`);
    console.log(`   Duration: ${plan.durationMinutes} minutes`);
    console.log(`   Created: ${plan.createdAt.toISOString()}`);
    console.log();
  });
}

async function viewPlanDetails() {
  const id = await question("Enter plan ID: ");
  const plan = await getSlidePlan(id.trim());

  if (!plan) {
    console.log("\nPlan not found.");
    return;
  }

  console.log("\n=== Plan Details ===");
  console.log(`Title: ${plan.title}`);
  console.log(`Audience: ${plan.audience}`);
  console.log(`Duration: ${plan.durationMinutes} minutes`);
  console.log(`Keywords: ${plan.keywords || "N/A"}`);
  console.log(`Template ID: ${plan.templateId || "N/A"}`);
  console.log(`Tags: ${plan.tags?.join(", ") || "N/A"}`);
  console.log(`Created: ${plan.createdAt.toISOString()}`);
  console.log(`\n=== Outline ===`);
  console.log(plan.outlineMarkdown);
}

async function listTemplates() {
  const result = await getAllTemplates();

  if (result.items.length === 0) {
    console.log("\nNo templates found.");
    return;
  }

  console.log(`\nFound ${result.total} template(s):\n`);
  result.items.forEach((template, index) => {
    console.log(`${index + 1}. ${template.name}`);
    console.log(`   ID: ${template.id}`);
    console.log(`   Category: ${template.category}`);
    console.log(`   Public: ${template.isPublic ? "Yes" : "No"}`);
    console.log(`   Usage Count: ${template.usageCount}`);
    console.log(`   Description: ${template.description}`);
    console.log();
  });
}

async function listPresentations() {
  const result = await getAllPresentations();

  if (result.items.length === 0) {
    console.log("\nNo presentations found.");
    return;
  }

  console.log(`\nFound ${result.total} presentation(s):\n`);
  result.items.forEach((presentation, index) => {
    console.log(`${index + 1}. ${presentation.title}`);
    console.log(`   ID: ${presentation.id}`);
    console.log(`   Status: ${presentation.status}`);
    console.log(`   Venue: ${presentation.venue || "N/A"}`);
    console.log(`   Scheduled: ${presentation.scheduledAt?.toISOString() || "N/A"}`);
    console.log();
  });
}

async function checkProviders() {
  const providers = getAvailableProviders();

  console.log("\n=== AI Provider Status ===\n");
  providers.forEach((provider) => {
    const status = provider.configured ? "✓ Configured" : "✗ Not configured";
    console.log(`${provider.metadata.name} (${provider.type}): ${status}`);
    console.log(`  Supported models: ${provider.metadata.supportedModels.join(", ")}`);
    console.log();
  });
}

async function showStatistics() {
  const [plans, templates, presentations] = await Promise.all([
    getAllSlidePlans(),
    getAllTemplates(),
    getAllPresentations(),
  ]);

  const deliveredCount = presentations.items.filter(
    (p) => p.status === "delivered"
  ).length;

  console.log("\n=== Statistics ===");
  console.log(`Total Slide Plans: ${plans.total}`);
  console.log(`Total Templates: ${templates.total}`);
  console.log(`Total Presentations: ${presentations.total}`);
  console.log(`Delivered Presentations: ${deliveredCount}`);
  console.log();
}

async function main() {
  while (true) {
    await showMenu();
    const choice = await question("Select an option: ");

    switch (choice.trim()) {
      case "1":
        await listPlans();
        break;
      case "2":
        await viewPlanDetails();
        break;
      case "3":
        await listTemplates();
        break;
      case "4":
        await listPresentations();
        break;
      case "5":
        await checkProviders();
        break;
      case "6":
        await showStatistics();
        break;
      case "0":
        console.log("\nGoodbye!");
        rl.close();
        process.exit(0);
      default:
        console.log("\nInvalid option. Please try again.");
    }
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
