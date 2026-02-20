{
  "name": "EmergencyContact",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "phone": {
      "type": "string"
    },
    "email": {
      "type": "string"
    },
    "relationship": {
      "type": "string"
    },
    "is_primary": {
      "type": "boolean",
      "default": false
    }
  },
  "required": [
    "name"
  ]
}