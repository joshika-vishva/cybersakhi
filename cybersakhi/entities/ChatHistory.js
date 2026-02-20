{
  "name": "ChatHistory",
  "type": "object",
  "properties": {
    "messages": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "role": {
            "type": "string"
          },
          "content": {
            "type": "string"
          },
          "timestamp": {
            "type": "string"
          }
        }
      }
    },
    "language": {
      "type": "string",
      "enum": [
        "english",
        "tamil",
        "tanglish"
      ],
      "default": "english"
    },
    "session_title": {
      "type": "string"
    }
  },
  "required": []
}