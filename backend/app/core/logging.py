import logging
from logging.handlers import RotatingFileHandler
import sys

def setup_logging(
    log_level: str = "INFO",
    log_file: str = "app.log",
    max_bytes: int = 5 * 1024 * 1024,  # 5 MB per file
    backup_count: int = 3
):
    """
    Sets up logging configuration for the FastAPI app.
    
    This configures both console and file logging with a rotating file handler.

    Args:
        log_level (str): Minimum log level to capture (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        log_file (str): Path to the log file
        max_bytes (int): Maximum size in bytes before rotating the log file
        backup_count (int): Number of backup log files to keep
    """

    # Create the root logger
    logger = logging.getLogger()
    logger.setLevel(getattr(logging, log_level.upper(), logging.INFO))
    
    # Formatter for log messages
    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    # Console handler (stdout)
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    # Rotating file handler
    file_handler = RotatingFileHandler(
        log_file,
        maxBytes=max_bytes,
        backupCount=backup_count
    )
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    # Optional: suppress overly verbose logs from libraries
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.error").setLevel(logging.INFO)
    
    logger.info("Logging is configured successfully.")
