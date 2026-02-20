{
  "name": "LearningContent",
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "category": {
      "type": "string",
      "enum": [
        "password_safety",
        "social_media",
        "phishing",
        "privacy",
        "harassment",
        "general"
      ]
    },
    "content": {
      "type": "string",
      "description": "Markdown content"
    },
    "language": {
      "type": "string",
      "enum": [
        "english",
        "tamil"
      ],
      "default": "english"
    },
    "difficulty": {
      "type": "string",
      "enum": [
        "beginner",
        "intermediate",
        "advanced"
      ],
      "default": "beginner"
    },
    "read_time": {
      "type": "number",
      "description": "Estimated read time in minutes"
    }
  },
  "required": [
    "title",
    "category",
    "content"
  ]
}