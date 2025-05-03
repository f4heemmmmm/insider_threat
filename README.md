# insider_threat

backend/
├── src/
│   ├── main.ts
│   ├── app.service.ts
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.controller.spec.ts
│   │
│   ├── config/
│   │   ├── app.config.ts
│   │   └── data-source.ts
│   │
│   ├── entities/
│   │   ├── alert/
│   │   │   ├── alert.controller.ts
│   │   │   ├── alert.entity.ts
│   │   │   ├── alert.dto.ts
│   │   │   ├── alert.service.ts
│   │   │   └── alert.module.ts
│   │   │
│   │   └── incident/
│   │       ├── incident.controller.ts
│   │       ├── incident.entity.ts
│   │       ├── incident.dto.ts
│   │       ├── incident.service.ts
│   │       └── incident.module.ts
│   │
│   ├── migrations/
│   │   └── createTables.ts
│   │
│   └── services/
│       └── csv-monitor.service.ts
│
└── storage/
    └── csv/
        ├── drop/
        │   ├── alerts/
        │   │   └── [csv files]
        │   └── incidents/
        │       └── [csv files]
        ├── error/
        └── processed/