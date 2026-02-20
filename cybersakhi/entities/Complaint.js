{
  "name": "Complaint",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Brief title of the complaint"
    },
    "category": {
      "type": "string",
      "enum": [
        "harassment",
        "phishing",
        "identity_theft",
        "cyberstalking",
        "morphed_images",
        "blackmail",
        "hacking",
        "other"
      ],
      "description": "Category of cyber crime"
    },
    "description": {
      "type": "string",
      "description": "Detailed description of the incident"
    },
    "evidence_urls": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "URLs of uploaded evidence files"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "under_review",
        "resolved",
        "escalated"
      ],
      "default": "pending"
    },
    "priority": {
      "type": "string",
      "enum": [
        "low",
        "medium",
        "high",
        "critical"
      ],
      "default": "medium"
    },
    "incident_date": {
      "type": "string",
      "format": "date"
    },
    "platform": {
      "type": "string",
      "description": "Platform where incident occurred"
    },
    "admin_notes": {
      "type": "string",
      "description": "Notes from admin/authority"
    },
    "resolution_date": {
      "type": "string",
      "format": "date"
    }
  },
  "required": [
    "title",
    "category",
    "description"
  ]
}