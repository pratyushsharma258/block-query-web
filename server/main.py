import os
import time
from typing import List, Optional, Dict, Any
import tensorflow as tf
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from contextlib import asynccontextmanager

from transformers import (
    TFBartForConditionalGeneration, 
    BartTokenizer,
    TFT5ForConditionalGeneration,
    T5Tokenizer,
    TFPegasusForConditionalGeneration,
    PegasusTokenizer,
    GenerationConfig
)

MAX_SOURCE_LENGTH = 1024
DEFAULT_MAX_LENGTH = 200
DEFAULT_TEMPERATURE = 1.0
DEFAULT_NUM_BEAMS = 4

MODEL_PATHS = {
    "bart": os.environ.get("BART_MODEL_PATH", "./models/BART"),
    "t5": os.environ.get("T5_MODEL_PATH", "./models/T5"),
    "flan-t5": os.environ.get("FLAN_T5_MODEL_PATH", "./models/FT5"),
    "pegasus": os.environ.get("PEGASUS_MODEL_PATH", "./models/PG"),
}

models = {}
tokenizers = {}

@asynccontextmanager
async def load_models(app: FastAPI):
    global models, tokenizers
    
    # BART model
    if "bart" in MODEL_PATHS and os.path.exists(MODEL_PATHS["bart"]):
        try:
            print(f"Loading BART model from {MODEL_PATHS['bart']}...")
            models["bart"] = TFBartForConditionalGeneration.from_pretrained(MODEL_PATHS["bart"])
            tokenizers["bart"] = BartTokenizer.from_pretrained(MODEL_PATHS["bart"])
            print("BART model loaded successfully!")
        except Exception as e:
            print(f"Error loading BART model: {str(e)}")
    
    # T5 model
    if "t5" in MODEL_PATHS and os.path.exists(MODEL_PATHS["t5"]):
        try:
            print(f"Loading T5 model from {MODEL_PATHS['t5']}...")
            models["t5"] = TFT5ForConditionalGeneration.from_pretrained(MODEL_PATHS["t5"])
            tokenizers["t5"] = T5Tokenizer.from_pretrained(MODEL_PATHS["t5"])
            print("T5 model loaded successfully!")
        except Exception as e:
            print(f"Error loading T5 model: {str(e)}")
    
    # Flan-T5 model
    if "flan-t5" in MODEL_PATHS and os.path.exists(MODEL_PATHS["flan-t5"]):
        try:
            print(f"Loading Flan-T5 model from {MODEL_PATHS['flan-t5']}...")
            models["flan-t5"] = TFT5ForConditionalGeneration.from_pretrained(MODEL_PATHS["flan-t5"])
            tokenizers["flan-t5"] = T5Tokenizer.from_pretrained(MODEL_PATHS["flan-t5"])
            print("Flan-T5 model loaded successfully!")
        except Exception as e:
            print(f"Error loading Flan-T5 model: {str(e)}")
    
    # Pegasus model
    if "pegasus" in MODEL_PATHS and os.path.exists(MODEL_PATHS["pegasus"]):
        try:
            print(f"Loading Pegasus model from {MODEL_PATHS['pegasus']}...")
            models["pegasus"] = TFPegasusForConditionalGeneration.from_pretrained(MODEL_PATHS["pegasus"])
            tokenizers["pegasus"] = PegasusTokenizer.from_pretrained(MODEL_PATHS["pegasus"])
            print("Pegasus model loaded successfully!")
        except Exception as e:
            print(f"Error loading Pegasus model: {str(e)}")

    yield 

    models.clear()
    tokenizers.clear()
    print("All models unloaded successfully!")
    

app = FastAPI(
    title="Blockchain QA API",
    description="API for answering blockchain-related questions using multiple transformer models",
    version="1.0.0",
    lifespan=load_models
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ModelParameters(BaseModel):
    max_length: int = Field(DEFAULT_MAX_LENGTH, description="Maximum length of generated answer")
    temperature: float = Field(DEFAULT_TEMPERATURE, description="Sampling temperature for generation")
    num_beams: int = Field(DEFAULT_NUM_BEAMS, description="Number of beams for beam search")

class QuestionRequest(BaseModel):
    question: str = Field(..., description="The blockchain-related question to answer")
    models: Optional[List[str]] = Field(None, description="List of models to use (if empty, all loaded models will be used)")
    parameters: Optional[ModelParameters] = Field(None, description="Generation parameters")

class ModelAnswer(BaseModel):
    model_name: str = Field(..., description="Name of the model")
    answer: str = Field(..., description="Generated answer")
    latency_ms: float = Field(..., description="Response time in milliseconds")

class AnswerResponse(BaseModel):
    question: str = Field(..., description="Original question")
    answers: List[ModelAnswer] = Field(..., description="Answers from requested models")
    timestamp: str = Field(..., description="Timestamp of the request")

class ModelInfo(BaseModel):
    name: str
    loaded: bool
    description: str

class ModelsResponse(BaseModel):
    available_models: List[ModelInfo]
    loaded_count: int
    total_count: int

class HealthResponse(BaseModel):
    status: str
    models_loaded: Dict[str, bool]
    uptime_seconds: float

start_time = time.time()

# Model descriptions
MODEL_DESCRIPTIONS = {
    "bart": "BART (Bidirectional and Auto-Regressive Transformers) - Denoising autoencoder for sequence-to-sequence tasks",
    "t5": "T5 (Text-to-Text Transfer Transformer) - Unified framework for NLP tasks as text-to-text generation",
    "flan-t5": "Flan-T5 - T5 model fine-tuned on a collection of tasks described via instructions",
    "pegasus": "Pegasus - Model optimized for abstractive summarization tasks"
}


# Error handler
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc), "type": str(type(exc).__name__)},
    )

# Health check endpoint
@app.get("/health", response_model=HealthResponse, tags=["System"])
async def health_check():
    return HealthResponse(
        status="healthy" if models else "degraded",
        models_loaded={model: model in models for model in MODEL_PATHS},
        uptime_seconds=round(time.time() - start_time, 2)
    )

# List available models
@app.get("/models", response_model=ModelsResponse, tags=["System"])
async def list_models():
    model_infos = []
    for model_name in MODEL_PATHS:
        model_infos.append(
            ModelInfo(
                name=model_name,
                loaded=model_name in models,
                description=MODEL_DESCRIPTIONS.get(model_name, "No description available")
            )
        )
    
    return ModelsResponse(
        available_models=model_infos,
        loaded_count=len(models),
        total_count=len(MODEL_PATHS)
    )

def cleanup_model_config(model):
    if hasattr(model.config, "max_length"):
        delattr(model.config, "max_length")
    if hasattr(model.config, "num_beams"):
        delattr(model.config, "num_beams")
    if hasattr(model.config, "length_penalty"):
        delattr(model.config, "length_penalty")
    return model

# Main prediction endpoint
@app.post("/predict", response_model=AnswerResponse, tags=["Prediction"])
async def generate_answers(request: QuestionRequest):
    if not models:
        raise HTTPException(status_code=503, detail="No models have been loaded")
    
    # Set default parameters if not provided
    if request.parameters is None:
        request.parameters = ModelParameters()
    
    # Determine which models to use
    model_names = request.models if request.models else list(models.keys())
    
    # Check if all requested models are available
    unavailable_models = [name for name in model_names if name not in models]
    if unavailable_models:
        raise HTTPException(
            status_code=400, 
            detail=f"Requested models not available: {', '.join(unavailable_models)}"
        )
    
    answers = []
    
    for model_name in model_names:
        try:
            start_time = time.time()
            
            if model_name == "bart":
                answer = process_bart(
                    request.question, 
                    request.parameters.max_length,
                    request.parameters.temperature,
                    request.parameters.num_beams
                )
            elif model_name in ["t5", "flan-t5"]:
                answer = process_t5(
                    model_name,
                    request.question, 
                    request.parameters.max_length,
                    request.parameters.temperature,
                    request.parameters.num_beams
                )
            elif model_name == "pegasus":
                answer = process_pegasus(
                    request.question, 
                    request.parameters.max_length,
                    request.parameters.temperature,
                    request.parameters.num_beams
                )
            else:
                raise ValueError(f"Processing not implemented for model '{model_name}'")
            
            end_time = time.time()
            latency_ms = (end_time - start_time) * 1000
            
            answers.append(
                ModelAnswer(
                    model_name=model_name,
                    answer=answer,
                    latency_ms=round(latency_ms, 2)
                )
            )
            
        except Exception as e:
            answers.append(
                ModelAnswer(
                    model_name=model_name,
                    answer=f"Error generating answer: {str(e)}",
                    latency_ms=0
                )
            )
    
    return AnswerResponse(
        question=request.question,
        answers=answers,
        timestamp=time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
    )

# Model specific processing functions
def process_bart(question: str, max_length: int, temperature: float, num_beams: int) -> str:
    model = models["bart"]
    tokenizer = tokenizers["bart"]
    
    # Prepare input
    input_text = question.lower().strip()
    inputs = tokenizer(
        input_text,
        return_tensors="tf",
        padding=True,
        truncation=True,
        max_length=MAX_SOURCE_LENGTH
    )
    
    # Generate answer
    outputs = model.generate(
        input_ids=inputs.input_ids,
        attention_mask=inputs.attention_mask,
        max_length=max_length,
        temperature=temperature,
        num_beams=num_beams,
        no_repeat_ngram_size=3,
        early_stopping=True
    )
    
    # Decode answer
    answer = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return answer

def process_t5(model_name: str, question: str, max_length: int, temperature: float, num_beams: int) -> str:
    model = models[model_name]
    tokenizer = tokenizers[model_name]
    
    # T5 expects a "question: " prefix
    input_text = f"question: {question.lower().strip()}"
    inputs = tokenizer(
        input_text,
        return_tensors="tf",
        padding=True,
        truncation=True,
        max_length=MAX_SOURCE_LENGTH
    )
    
    outputs = model.generate(
        input_ids=inputs.input_ids,
        attention_mask=inputs.attention_mask,
        max_length=max_length,
        temperature=temperature,
        num_beams=num_beams,
        no_repeat_ngram_size=3,
        early_stopping=True
    )
    
    answer = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return answer

def process_pegasus(question: str, max_length: int, temperature: float, num_beams: int) -> str:
    model = models["pegasus"]

    model = cleanup_model_config(model)
    tokenizer = tokenizers["pegasus"]
    
    # Create generation config using the proper class
    generation_config = GenerationConfig(
        max_length=max_length,
        temperature=temperature,
        num_beams=num_beams,
        no_repeat_ngram_size=3,
        early_stopping=True
    )
    
    input_text = question.lower().strip()
    
    inputs = tokenizer(
        input_text,
        return_tensors="tf",
        padding=True,
        truncation=True,
        max_length=MAX_SOURCE_LENGTH
    )
    
    # Use generation config in generate method
    outputs = model.generate(
        input_ids=inputs.input_ids,
        attention_mask=inputs.attention_mask,
        generation_config=generation_config
    )
    
    answer = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return answer

if __name__ == "__main__":
    import uvicorn
    
    port = int(os.environ.get("PORT", 8000))
    
    uvicorn.run("blockchain_qa_api:app", host="0.0.0.0", port=port, reload=False)