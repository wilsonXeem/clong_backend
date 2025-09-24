import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CloNG API",
      version: "1.0.0",
      description: "API documentation for CloNG website",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            email: { type: "string", format: "email", maxLength: 255 },
            firstName: { type: "string", maxLength: 100 },
            lastName: { type: "string", maxLength: 100 },
            phone: { type: "string", maxLength: 20 },
            role: { type: "string", enum: ["user", "admin"], default: "user" },
            isActive: { type: "boolean", default: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        Program: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string", maxLength: 255 },
            description: { type: "string" },
            imageUrl: { type: "string", maxLength: 500 },
            targetAmount: { type: "string", format: "decimal" },
            currentAmount: { type: "string", format: "decimal", default: "0" },
            startDate: { type: "string", format: "date-time" },
            endDate: { type: "string", format: "date-time" },
            isActive: { type: "boolean", default: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        Event: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string", maxLength: 255 },
            description: { type: "string" },
            imageUrl: { type: "string", maxLength: 500 },
            location: { type: "string", maxLength: 255 },
            eventDate: { type: "string", format: "date-time" },
            maxAttendees: { type: "integer" },
            currentAttendees: { type: "integer", default: 0 },
            isActive: { type: "boolean", default: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        Donation: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            programId: { type: "string", format: "uuid" },
            amount: { type: "string", format: "decimal" },
            donorName: { type: "string", maxLength: 255 },
            donorEmail: { type: "string", format: "email", maxLength: 255 },
            isAnonymous: { type: "boolean", default: false },
            paymentStatus: { type: "string", enum: ["pending", "completed", "failed"], default: "pending" },
            paymentReference: { type: "string", maxLength: 255 },
            createdAt: { type: "string", format: "date-time" }
          }
        },
        Article: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string", maxLength: 255 },
            slug: { type: "string", maxLength: 255 },
            excerpt: { type: "string", maxLength: 500 },
            content: { type: "string" },
            featuredImage: { type: "string", maxLength: 500 },
            authorId: { type: "string", format: "uuid" },
            isPublished: { type: "boolean", default: false },
            publishedAt: { type: "string", format: "date-time" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        Story: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string", maxLength: 255 },
            content: { type: "string" },
            imageUrl: { type: "string", maxLength: 500 },
            authorId: { type: "string", format: "uuid" },
            isPublished: { type: "boolean", default: false },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        Resource: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string", maxLength: 255 },
            description: { type: "string" },
            fileUrl: { type: "string", maxLength: 500 },
            fileType: { type: "string", maxLength: 100 },
            category: { type: "string", maxLength: 100 },
            isPublic: { type: "boolean", default: true },
            uploadedBy: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        Newsletter: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            email: { type: "string", format: "email", maxLength: 255 },
            isActive: { type: "boolean", default: true },
            subscribedAt: { type: "string", format: "date-time" },
            unsubscribedAt: { type: "string", format: "date-time" }
          }
        },
        Volunteer: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            skills: { type: "string" },
            availability: { type: "string" },
            interests: { type: "string" },
            experience: { type: "string" },
            motivation: { type: "string" },
            status: { type: "string", enum: ["pending", "approved", "rejected"], default: "pending" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        EventRegistration: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            eventId: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            attendeeName: { type: "string", maxLength: 255 },
            attendeeEmail: { type: "string", format: "email", maxLength: 255 },
            attendeePhone: { type: "string", maxLength: 20 },
            registrationDate: { type: "string", format: "date-time" }
          }
        }
      }
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], // Path to route and controller files
};

export const specs = swaggerJsdoc(options);
export { swaggerUi };