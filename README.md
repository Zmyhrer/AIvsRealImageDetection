# AI vs Real Image Detection

A full-stack web application designed to help users distinguish between AI-generated synthetic images and authentic photographs. In an era of advanced image generation tools, this project provides a practical tool for verifying the authenticity of visual media.

The application features a modern, responsive user interface built with React and a robust, high-performance backend powered by FastAPI and a pre-trained Convolutional Neural Network from Hugging Face.

## Features

-   **Intuitive Image Upload:** Drag-and-drop or click-to-select interface for uploading images.
-   **AI-Powered Classification:** Utilizes a CNN to analyze images and predict whether they are "AI" or "Real".
-   **Confidence Scoring:** Provides a confidence percentage for each prediction, giving users insight into the model's certainty.
-   **Visual Feedback:** A color-coded confidence bar offers a quick visual representation of the result.
-   **Session History:** Maintains a history of analyzed images in the browser's local storage for easy comparison.
-   **Robust Error Handling:** Gracefully handles invalid files, network errors, and server-side issues with user-friendly notifications.

## Tech Stack

### Frontend
-   **React 18**
-   **TypeScript**
-   **Tailwind CSS**
-   **Jest & React Testing Library** (for testing)

### Backend
-   **Python 3.9+**
-   **FastAPI**
-   **PyTest** (for testing)
-   **Pillow** (for image processing)
-   **Transformers & PyTorch** (for AI model integration)

### AI/ML Model
-   **Model:** `Ateeqq/ai-vs-human-image-detector`
-   **Source:** [Hugging Face](https://huggingface.co/Ateeqq/ai-vs-human-image-detector)

## Project Structure

```
AIvsRealImageDetection/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       └── routes/
│   │   │           └── predict.py      # Main prediction API endpoint
│   │   ├── core/
│   │   │   └── logging.py           # Logging configuration
│   │   ├── service/
│   │   │   └── model_service.py    # AI model integration logic
│   │   ├── middleware.py              # CORS and request logging
│   │   └── main.py                   # FastAPI application factory
│   ├── tests/
│   │   └── test_predict_endpoint.py # Backend test suite
│   └── requirements.txt               # Python dependencies
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── predict.ts         # API service for frontend
│   │   ├── components/
│   │   │   ├── Dropzone.tsx
│   │   │   ├── HomePage.tsx
│   │   │   └── ... (other UI components)
│   │   ├── tests/
│   │   │   └── ... (frontend test suites)
│   │   └── ...
│   ├── package.json                  # Node.js dependencies and scripts
│   └── tailwind.config.js
└── README.md
```

## Prerequisites

Before you begin, ensure you have the following installed on your system:
-   [Node.js](https://nodejs.org/) (v18 or higher)
-   [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/)
-   [Python](https://www.python.org/downloads/) (v3.9 or higher)
-   [pip](https://pip.pypa.io/en/stable/installation/) (comes with Python)
-   [Git](https://git-scm.com/)

## Setup and Running the Application

Follow these steps to get the entire application running on your local machine.

### 1. Clone the Repository

First, clone the project from GitHub and navigate into the directory.

```bash
git clone https://github.com/Zmyhrer/AIvsRealImageDetection.git
cd AIvsRealImageDetection
```

### 2. Backend Setup

The backend serves the API and runs the AI model.

1.  Navigate into the `backend` directory:
    ```bash
    cd backend
    ```

2.  Create and activate a Python virtual environment:
    -   **On macOS/Linux:**
        ```bash
        python3 -m venv venv
        source venv/bin/activate
        ```
    -   **On Windows:**
        ```bash
        python -m venv venv
        .\venv\Scripts\activate
        ```

3.  Install the required Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  Start the FastAPI server:
    ```bash
    uvicorn main:app --reload
    ```
    The backend API will now be running at `http://127.0.0.1:8000`. You can view the auto-generated API documentation at `http://127.0.0.1:8000/docs`.

### 3. Frontend Setup

The frontend is the user interface that communicates with the backend.

1.  Open a **new** terminal window (leave the backend server running).

2.  Navigate into the `frontend` directory:
    ```bash
    cd frontend
    ```

3.  Install the required Node.js dependencies:
    ```bash
    npm install
    ```

4.  Start the React development server:
    ```bash
    npm run dev
    ```
    The frontend application will now be running, typically at `http://localhost:5173`.

### 4. Access the Application

You can now access the full application by opening your web browser and navigating to:

**http://localhost:5173**

You can now upload images and receive AI vs. Real predictions!

## Running Tests

This project includes comprehensive test suites for both the backend and frontend.

### Backend Tests

With your virtual environment activated in the `backend` directory, run:

```bash
pytest
```

### Frontend Tests

From the `frontend` directory, run:

```bash
npm test
```

## API Documentation

Once the backend server is running, you can explore the interactive API documentation provided by FastAPI. This is a great way to understand the available endpoints and their expected inputs/outputs.

**Access the docs at:** `http://127.0.0.1:8000/docs`

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!