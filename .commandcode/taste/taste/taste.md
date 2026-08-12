# Taste
- Communicates in Spanish; expects assistant responses in Spanish. Confidence: 0.9
- Prefers distinct groups of fields to be separated into their own Bootstrap `.row`s (each field group in its own `col-md`) rather than packing multiple groups together under a single `col-md`. Confidence: 0.6
- Prefers action buttons (create, edit, delete, etc.) to include icons; Bootstrap Icons is the established icon set in this project. Confidence: 0.6
- Prefers reusing existing project components/patterns over building new ones; when asked to add a feature, explicitly wants prior implementations in the codebase found and followed. Confidence: 0.85
- Keeps parallel/analogous views (e.g., Cotizaciones detail and Ventas detail) structurally consistent: when a layout or field placement is done in one view, expects the exact same structure replicated in the sibling view. Confidence: 0.7
- Prefers frontend features to wire into variables/fields the backend already supports (e.g., points out "el backend ya tiene la variable") rather than inventing new ones or requiring backend changes. Confidence: 0.6
- When a frontend feature depends on backend support, wants a clear explanation of the API/database changes needed to complete the flow. Confidence: 0.7
- Wants end-to-end data handling: a field captured during creation (e.g., `hora_inicio`) must not only be saved in the payload but also visible AND editable in the entity's detail views (e.g., quote detail, sale detail) — explicitly asked for it to be editable, not just displayed. Confidence: 0.7
