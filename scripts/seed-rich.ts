#!/usr/bin/env tsx

/**
 * Rich seed script with comprehensive demo data
 * Usage: npm run db:seed:rich
 */

import { saveSlidePlan, generateId as generatePlanId } from "../lib/storage";
import { saveTemplate, generateTemplateId } from "../lib/storage/templates";
import { savePresentation, generatePresentationId } from "../lib/storage/presentations";
import { saveUser, generateUserId } from "../lib/storage/users";
import {
  SlidePlan,
  SlideTemplate,
  Presentation,
  User,
  TemplateCategory,
  PresentationStatus,
} from "../lib/types";

// Define personas
const users: Omit<User, "id" | "createdAt" | "updatedAt">[] = [
  {
    email: "alice@techcorp.com",
    name: "Alice Johnson",
    preferences: {
      defaultDuration: 30,
      favoriteCategory: "technology",
      language: "ja",
    },
  },
  {
    email: "bob@startup.io",
    name: "Bob Smith",
    preferences: {
      defaultDuration: 45,
      favoriteCategory: "business",
      language: "en",
    },
  },
  {
    email: "carol@university.edu",
    name: "Carol Lee",
    preferences: {
      defaultDuration: 60,
      favoriteCategory: "academic",
      language: "ja",
    },
  },
];

// Define templates
const templates: Omit<SlideTemplate, "id" | "createdAt" | "updatedAt" | "usageCount">[] = [
  {
    name: "Technology Introduction Template",
    description: "Perfect for introducing new technologies to engineering teams",
    category: TemplateCategory.TECHNOLOGY,
    structure: `# Introduction
- What is {topic}?
- Why it matters
- Today's agenda

# Background & Context
- Historical context
- Current state of the art
- Market trends

# Technical Deep Dive
- Core concepts
- Architecture overview
- Key features

# Practical Examples
- Use case 1
- Use case 2
- Code demonstration

# Getting Started
- Installation & setup
- First steps
- Best practices

# Conclusion & Q&A
- Summary of key points
- Next steps
- Questions`,
    tags: ["technology", "introduction", "engineering"],
    isPublic: true,
  },
  {
    name: "Business Pitch Deck",
    description: "Professional template for business presentations and pitches",
    category: TemplateCategory.BUSINESS,
    structure: `# Title Slide
- Company/Project name
- Tagline
- Date & Presenter

# Problem Statement
- What problem are we solving?
- Who experiences this problem?
- Why is it important?

# Solution
- Our approach
- Key features
- Unique value proposition

# Market Opportunity
- Target market size
- Growth potential
- Competitive landscape

# Business Model
- Revenue streams
- Pricing strategy
- Key partnerships

# Traction & Milestones
- Current status
- Key achievements
- User/customer metrics

# Financial Projections
- Revenue forecast
- Cost structure
- Path to profitability

# Team
- Key team members
- Advisory board
- Hiring plans

# Ask & Next Steps
- What we're seeking
- Use of funds
- Timeline`,
    tags: ["business", "pitch", "sales"],
    isPublic: true,
  },
  {
    name: "Academic Research Presentation",
    description: "Structured template for academic research presentations",
    category: TemplateCategory.ACADEMIC,
    structure: `# Title & Abstract
- Research title
- Authors & affiliations
- Brief abstract

# Introduction & Motivation
- Research question
- Why this matters
- Background literature

# Research Methodology
- Study design
- Data collection methods
- Analysis approach

# Results & Findings
- Key findings
- Data visualization
- Statistical significance

# Discussion
- Interpretation of results
- Comparison with prior work
- Limitations

# Conclusions & Future Work
- Summary of contributions
- Implications
- Future research directions

# References & Acknowledgments
- Key citations
- Funding sources
- Thank you`,
    tags: ["academic", "research", "science"],
    isPublic: true,
  },
  {
    name: "Training Workshop Template",
    description: "Interactive template for training sessions and workshops",
    category: TemplateCategory.TRAINING,
    structure: `# Welcome & Objectives
- Introduction
- Learning objectives
- Agenda overview

# Ice Breaker
- Participant introductions
- Warm-up activity
- Setting expectations

# Module 1: Fundamentals
- Core concepts
- Key terminology
- Guided examples

# Module 2: Hands-On Practice
- Exercise 1
- Exercise 2
- Group activity

# Module 3: Advanced Topics
- Deep dive
- Common challenges
- Pro tips

# Real-World Applications
- Case study 1
- Case study 2
- Best practices

# Review & Assessment
- Key takeaways
- Quiz/assessment
- Certification

# Resources & Next Steps
- Additional materials
- Support channels
- Follow-up actions`,
    tags: ["training", "workshop", "interactive"],
    isPublic: true,
  },
];

// Define plans with various scenarios
const plans: Omit<SlidePlan, "id" | "createdAt" | "updatedAt">[] = [
  {
    title: "Introduction to Rust Programming",
    audience: "Intermediate developers",
    durationMinutes: 45,
    keywords: "Rust, systems programming, memory safety",
    outlineMarkdown: `# Why Rust?
- Memory safety without garbage collection
- Concurrency without data races
- Zero-cost abstractions

# Ownership & Borrowing
- The ownership system
- Borrowing rules
- Lifetimes explained

# Practical Examples
- Building a CLI tool
- Web server with Actix
- Performance comparison

# Ecosystem & Tools
- Cargo package manager
- Popular crates
- Testing and documentation

# Conclusion
- When to use Rust
- Learning resources
- Community support`,
    templateId: "", // Will be filled during seeding
    version: 1,
    tags: ["rust", "programming", "systems"],
    metadata: { difficulty: "intermediate", estimatedPrepTime: 120 },
  },
  {
    title: "Effective Remote Team Management",
    audience: "Engineering managers",
    durationMinutes: 30,
    keywords: "remote work, team management, productivity",
    outlineMarkdown: `# The Remote Work Reality
- Statistics and trends
- Challenges and opportunities
- Setting the stage

# Communication Best Practices
- Async vs sync communication
- Tool selection
- Documentation culture

# Building Team Culture
- Virtual team building
- Recognition and celebration
- Maintaining connections

# Productivity & Wellbeing
- Managing work-life balance
- Preventing burnout
- Flexible schedules

# Metrics That Matter
- Output vs hours
- Team health indicators
- Continuous improvement`,
    version: 1,
    tags: ["management", "remote", "productivity"],
    metadata: { difficulty: "beginner", targetRole: "manager" },
  },
  {
    title: "Machine Learning for Medical Diagnosis",
    audience: "Healthcare professionals and data scientists",
    durationMinutes: 60,
    keywords: "machine learning, medical imaging, diagnosis",
    outlineMarkdown: `# Introduction
- AI in healthcare landscape
- Research objectives
- Ethical considerations

# Medical Imaging Basics
- CT, MRI, X-ray fundamentals
- Image preprocessing
- Annotation challenges

# Deep Learning Architectures
- CNNs for medical images
- Transfer learning
- Model architectures (ResNet, EfficientNet)

# Dataset & Training
- Medical image datasets
- Data augmentation strategies
- Handling class imbalance

# Results & Validation
- Performance metrics
- Clinical validation
- Comparison with radiologists

# Deployment Considerations
- Integration with PACS systems
- Regulatory compliance (FDA, CE)
- Explainability requirements

# Conclusion
- Summary of findings
- Limitations and future work
- Collaboration opportunities`,
    templateId: "", // Will be filled during seeding
    version: 1,
    tags: ["machine-learning", "healthcare", "research"],
    metadata: { difficulty: "advanced", domain: "healthcare" },
  },
];

async function seedRich() {
  console.log("🌱 Starting rich data seeding...\n");

  const createdUsers: User[] = [];
  const createdTemplates: SlideTemplate[] = [];
  const createdPlans: SlidePlan[] = [];

  try {
    // Seed users
    console.log("👥 Creating users...");
    for (const userData of users) {
      const now = new Date();
      const user: User = {
        ...userData,
        id: generateUserId(),
        createdAt: now,
        updatedAt: now,
      };
      await saveUser(user);
      createdUsers.push(user);
      console.log(`  ✓ ${user.name} (${user.email})`);
    }

    // Seed templates
    console.log("\n📋 Creating templates...");
    for (const templateData of templates) {
      const now = new Date();
      const template: SlideTemplate = {
        ...templateData,
        id: generateTemplateId(),
        usageCount: 0,
        createdAt: now,
        updatedAt: now,
      };
      await saveTemplate(template);
      createdTemplates.push(template);
      console.log(`  ✓ ${template.name}`);
    }

    // Seed plans with template associations
    console.log("\n📊 Creating slide plans...");
    for (let i = 0; i < plans.length; i++) {
      const planData = plans[i];
      const now = new Date(Date.now() - i * 86400000); // Stagger dates
      const plan: SlidePlan = {
        ...planData,
        id: generatePlanId(),
        templateId: i < createdTemplates.length ? createdTemplates[i].id : undefined,
        userId: createdUsers[i % createdUsers.length].id,
        createdAt: now,
        updatedAt: now,
      };
      await saveSlidePlan(plan);
      createdPlans.push(plan);
      console.log(`  ✓ ${plan.title}`);
    }

    // Seed presentations
    console.log("\n🎤 Creating presentations...");
    const presentations: Presentation[] = [
      {
        id: generatePresentationId(),
        planId: createdPlans[0].id,
        title: createdPlans[0].title,
        status: PresentationStatus.DELIVERED,
        venue: "Tech Conference 2024",
        scheduledAt: new Date("2024-03-15T14:00:00"),
        deliveredAt: new Date("2024-03-15T14:45:00"),
        audienceSize: 85,
        feedback: "Great session! Very informative and well-paced.",
        userId: createdPlans[0].userId,
        createdAt: new Date("2024-03-01"),
        updatedAt: new Date("2024-03-15"),
      },
      {
        id: generatePresentationId(),
        planId: createdPlans[1].id,
        title: createdPlans[1].title,
        status: PresentationStatus.UPCOMING,
        venue: "Company All-Hands Meeting",
        scheduledAt: new Date(Date.now() + 7 * 86400000), // 7 days from now
        userId: createdPlans[1].userId,
        notes: "Remember to prepare demo environment",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generatePresentationId(),
        planId: createdPlans[2].id,
        title: createdPlans[2].title,
        status: PresentationStatus.DRAFT,
        userId: createdPlans[2].userId,
        notes: "Still working on slides, need to add more diagrams",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const presentation of presentations) {
      await savePresentation(presentation);
      console.log(`  ✓ ${presentation.title} (${presentation.status})`);
    }

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("✨ Rich seeding completed successfully!\n");
    console.log("📊 Summary:");
    console.log(`  • Users: ${createdUsers.length}`);
    console.log(`  • Templates: ${createdTemplates.length}`);
    console.log(`  • Slide Plans: ${createdPlans.length}`);
    console.log(`  • Presentations: ${presentations.length}`);
    console.log("\n💡 Next steps:");
    console.log("  • Run 'npm run cli' to explore the data");
    console.log("  • Start dev server: 'npm run dev'");
    console.log("  • Run tests: 'npm test'");
    console.log("=".repeat(50) + "\n");
  } catch (error) {
    console.error("\n❌ Error seeding data:", error);
    process.exit(1);
  }
}

seedRich();
