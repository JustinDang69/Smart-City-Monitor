# Smart Air & Noise Quality Monitoring System

A **serverless smart-city environmental analytics platform** developed as my solo **NIT3004 IT Capstone Project 2** at Victoria University.

The system processes environmental data for Braybrook, Melbourne across four domains:

- Air quality
- Noise
- Weather
- Traffic

It combines an automated AWS data-processing pipeline with an interactive dashboard, forecasting, statistical analysis and AI-assisted interpretation.

🌐 **Live System:**  
https://justindang69.github.io/Smart-City-Monitor/

---

## Project Overview

Urban environmental monitoring often involves data arriving from multiple independent sources in inconsistent formats.

This project was designed to bring those datasets into a single platform that can:

- accept environmental data uploads
- automatically clean and validate incoming files
- store raw and processed data in the cloud
- serve cleaned data efficiently
- visualise environmental trends
- generate forecasts
- compare measurements against environmental benchmarks
- analyse relationships between pollution, traffic and weather
- generate plain-language AI-assisted explanations
- produce downloadable reports

The project began with research, requirements analysis and solution planning during **IT Capstone Project 1**, then progressed into the complete implementation during **IT Capstone Project 2**.

---

## System Architecture

```text
                         ┌─────────────────────┐
                         │   User / Browser    │
                         └──────────┬──────────┘
                                    │
                     ┌──────────────┴──────────────┐
                     │                             │
              Public Dashboard               Admin Upload
                     │                             │
              GitHub Pages                  AWS Cognito
                     │                             │
                     │                       API Gateway
                     │                             │
                     │                  generateS3UploadUrl
                     │                             │
                     │                      Presigned PUT
                     │                             │
                     │                         Amazon S3
                     │                        raw uploads
                     │                             │
                     │                      S3 Event Trigger
                     │                             │
                     │                     DataProcessing
                     │                         Lambda
                     │                             │
                     │                   Cleaned / Validated
                     │                          Data
                     │                             │
                     └────── Amazon CloudFront ◄───┘
                                    │
                              Dashboard
                                    │
                       ┌────────────┴────────────┐
                       │                         │
                 Forecasting              AnalyzePatterns
                                              Lambda
                                                 │
                                      Pearson Correlation
                                                 │
                                          NVIDIA NIM
                                                 │
                                      AI Cause Analysis
```

The architecture separates the **data-write path** from the **public read path**.

Raw uploads are processed asynchronously through an event-driven AWS pipeline, while cleaned data is delivered separately to the dashboard through CloudFront. This prevents upload or processing problems from directly affecting the public visualisation layer. :chatgpt-content-reference{index="1"}

---

## Data Pipeline

The system uses an automated serverless ETL workflow.

```text
Raw Environmental CSV
        ↓
Authenticated Upload
        ↓
Amazon S3
        ↓
S3 ObjectCreated Event
        ↓
AWS Lambda
        ↓
Parse
        ↓
Standardise Columns
        ↓
Validate Values
        ↓
Remove Unnecessary Fields
        ↓
Deduplicate Records
        ↓
Generate Cleaning Summary
        ↓
Cleaned Dataset
        ↓
Amazon S3
        ↓
CloudFront
        ↓
Interactive Dashboard
```

The processing Lambda converts raw sensor exports into a consistent, analysis-ready structure.

Key processing stages include:

- CSV parsing
- column-name standardisation
- numeric type conversion
- physically plausible range validation
- removal of redundant fields
- duplicate detection
- canonical schema generation
- cleaning reports and audit information

The pipeline automatically runs when new raw CSV files are uploaded. :chatgpt-content-reference{index="2"}

---

## Environmental Data

The platform supports four environmental dataset types:

### Air Quality

Examples include:

- PM2.5
- PM10
- NO₂
- CO
- CO₂
- AQI
- temperature
- humidity

### Noise

Includes noise measurements and related environmental observations.

### Weather

Includes variables such as:

- temperature
- humidity
- rainfall
- wind speed

### Traffic

Includes traffic measurements used to investigate relationships between vehicle activity and environmental conditions.

The project processed more than **122,000 environmental records** across these dataset categories.

---

## Interactive Dashboard

The dashboard allows users to explore environmental conditions using:

- dataset selection
- monitoring-site selection
- date-range filtering
- hourly, daily, weekly and monthly aggregation
- KPI summary cards
- interactive charts
- environmental benchmark overlays
- data tables
- forecasting
- AI-assisted cause analysis

The interface supports both desktop and mobile layouts.

---

## Forecasting

The dashboard includes short- and longer-term forecasting functionality designed to help identify environmental trends.

Forecasting is performed client-side so users can receive analytical results without requiring an additional always-on analytics server.

The current implementation is intended as an analytical demonstration rather than a production environmental forecasting service.

---

## AI-Assisted Cause Analysis

One of the main analytical features is the **AI Cause Analysis**.

The system first performs statistical analysis rather than asking an LLM to guess relationships.

Environmental datasets are aligned to common **10-minute time intervals**, allowing independently collected traffic, weather and pollution observations to be compared.

The backend then calculates **Pearson correlation coefficients** between environmental outcomes and potential drivers. :chatgpt-content-reference{index="3"}

The resulting statistics are passed to an NVIDIA NIM-hosted large language model, which converts the measured relationships into a plain-language explanation and possible policy actions.

```text
Environmental Data
        ↓
Time Alignment
        ↓
Pearson Correlation
        ↓
Measured Relationships
        ↓
NVIDIA NIM LLM
        ↓
Plain-Language Explanation
        ↓
Suggested Actions
```

This approach separates:

**Statistical calculation** → performed programmatically

from

**Natural-language interpretation** → assisted by the LLM.

If the external AI service is unavailable, the application provides a fallback explanation rather than breaking the dashboard. :chatgpt-content-reference{index="4"}

---

## AWS Architecture

The backend is serverless and uses:

### Amazon S3
Stores raw uploads, cleaned datasets and generated processing summaries.

### AWS Lambda
Four purpose-built Lambda functions support:

- generating secure upload URLs
- automated data processing
- cleaned-file discovery
- statistical and AI-assisted analysis

### Amazon API Gateway
Provides HTTP endpoints connecting the frontend to backend Lambda functions.

### Amazon CloudFront
Provides fast read-only delivery of cleaned environmental datasets.

### Amazon Cognito
Protects administrator functionality such as dataset uploads.

### GitHub Pages
Hosts the public frontend.

### GitHub Actions
Automatically deploys the frontend when updates are pushed to the main branch.

---

## Security Design

Several security decisions were incorporated into the architecture:

- administrator authentication through AWS Cognito
- private S3 storage
- short-lived presigned URLs for uploads
- CloudFront for controlled read access
- CORS restrictions
- separation between public and administrative functions
- server-side handling of the NVIDIA API key
- least-privilege AWS IAM permissions

Sensitive API credentials are kept server-side and are not included in the browser application.

---

## Technologies

### Data & Analytics

- JavaScript
- Python
- CSV data processing
- Pearson correlation
- time-series aggregation
- forecasting
- environmental data analysis

### AWS

- Amazon S3
- AWS Lambda
- Amazon API Gateway
- Amazon CloudFront
- Amazon Cognito
- AWS IAM

### AI

- NVIDIA NIM
- Llama-based large language model
- AI-assisted analytical interpretation

### Frontend

- HTML5
- CSS3
- JavaScript
- Chart.js
- Responsive web design

### Deployment

- GitHub
- GitHub Pages
- GitHub Actions

---

## Key Features

- Automated environmental-data ETL pipeline
- Event-driven AWS processing
- Four environmental dataset categories
- Data validation and duplicate removal
- Interactive environmental dashboard
- Date and location filtering
- KPI summaries
- Environmental benchmark comparisons
- Forecasting and trend analysis
- Statistical cause analysis
- LLM-assisted explanation
- Secure administrator uploads
- Downloadable reports
- Responsive interface
- Automated frontend deployment

---

## Repository Structure

```text
Smart-City-Monitor/
│
├── index.html
├── dashboard.html
├── reports.html
├── admin.html
├── about.html
│
├── css/
│
├── js/
│   ├── main.js
│   ├── dashboard.js
│   ├── reports.js
│   └── admin.js
│
├── .github/
│   └── workflows/
│
├── docs/
│   ├── E Poster.png
│   └── Technical_Implementation_Document_s8149950.docx
│
├── LICENSE
└── README.md
```

---

## Documentation

Additional project documentation is available in the `docs/` directory.

### E-Poster

`docs/E Poster.png`

Provides a visual overview of:

- the project problem
- AWS architecture
- automated data pipeline
- dashboard
- project outcomes
- future development roadmap

### Technical Implementation Document

`docs/Technical_Implementation_Document_s8149950.docx`

Contains detailed discussion of:

- system architecture
- data-cleaning algorithms
- Lambda implementation
- AWS design decisions
- file-discovery logic
- statistical analysis
- AI integration
- authentication
- security
- testing
- limitations

---

## Project Outcomes

The completed system demonstrates how cloud computing, data engineering, analytics and AI can be combined into a single smart-city application.

The final platform provides:

- an automated environmental data pipeline
- cloud-based processing
- multi-dataset analytics
- interactive visualisation
- forecasting
- statistical analysis
- AI-assisted interpretation
- secure administrative functionality
- scalable serverless architecture

---

## Limitations

The current system remains a capstone-scale implementation.

Current limitations include:

- some environmental data is synthetic where real sensor coverage is incomplete
- forecasting uses a relatively lightweight analytical approach
- LLM analysis introduces several seconds of latency
- the backend currently operates in a single AWS region
- authentication is focused primarily on administrative functionality

These limitations also provide clear directions for future development. :chatgpt-content-reference{index="5"}

---

## Future Improvements

Potential future work includes:

- integration with live IoT sensor feeds
- richer time-series forecasting models
- additional environmental monitoring locations
- geospatial visualisation
- automatic environmental alerts
- caching AI analyses
- expanded role-based access control
- multi-region deployment
- mobile application support
- predictive environmental modelling

---

## Project Context

This system was developed as my **solo NIT3004 IT Capstone Project 2** at Victoria University.

It represents the implementation stage of a broader project that began with research and planning during IT Capstone Project 1.

The complete system was designed, implemented, tested, deployed and documented individually.

---

## Author

**Justin Dang**

Data Science  
Victoria University
