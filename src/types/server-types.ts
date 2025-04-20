/**
 * Parameters for controlling model generation behavior
 */
export interface ModelParameters {
  /** Maximum length of generated answer */
  max_length: number;
  /** Sampling temperature for generation */
  temperature: number;
  /** Number of beams for beam search */
  num_beams: number;
}

/**
 * Request payload for asking a blockchain-related question
 */
export interface QuestionRequest {
  /** The blockchain-related question to answer */
  question: string;
  /** List of models to use (if empty, all loaded models will be used) */
  models?: string[];
  /** Generation parameters */
  parameters?: ModelParameters;
}

/**
 * Represents an answer from a specific model
 */
export interface ModelAnswer {
  /** Name of the model */
  model_name: string;
  /** Generated answer */
  answer: string;
  /** Response time in milliseconds */
  latency_ms: number;
}

/**
 * Response containing answers from requested models
 */
export interface AnswerResponse {
  /** Original question */
  question: string;
  /** Answers from requested models */
  answers: ModelAnswer[];
  /** Timestamp of the request */
  timestamp: string;
}

/**
 * Information about a specific model
 */
export interface ModelInfo {
  /** Model name */
  name: string;
  /** Whether the model is currently loaded */
  loaded: boolean;
  /** Description of the model */
  description: string;
}

/**
 * Response containing information about available models
 */
export interface ModelsResponse {
  /** List of all available models */
  available_models: ModelInfo[];
  /** Number of currently loaded models */
  loaded_count: number;
  /** Total number of models */
  total_count: number;
}

/**
 * Response for health check endpoint
 */
export interface HealthResponse {
  /** Current status of the API */
  status: string;
  /** Map of model names to their loaded status */
  models_loaded: Record<string, boolean>;
  /** Time in seconds that the server has been running */
  uptime_seconds: number;
}
