import logging
from logging import Handler
import sys
from pathlib import Path


class PrependFileHandler(Handler):
    """
    A custom log handler that prepends new log entries to the top of the file.
    This ensures the newest log messages appear first.
    """

    def __init__(self, file_path: str):
        super().__init__()
        self.file_path = Path(file_path)

    def emit(self, record: logging.LogRecord) -> None:
    
        try:
            message = self.format(record)
            old_content = ""

            if self.file_path.exists():
                old_content = self.file_path.read_text()

            new_content = f"{message}\n{old_content}"
            self.file_path.write_text(new_content)

        except Exception:
            self.handleError(record)


def setup_logging(
    log_level: str = "INFO",
    log_file: str = "app.log",
):
    """
    Configures application logging such that the newest entries
    are always written at the top of the log file.h.
    """

    logger = logging.getLogger()
    logger.setLevel(getattr(logging, log_level.upper(), logging.INFO))

    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        datefmt="%d-%m-%Y %H:%M:%S"
    )

    # Console output handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    # Prepend-style file handler
    file_handler = PrependFileHandler(log_file)
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    # Quiet common noisy loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.error").setLevel(logging.INFO)

    logger.info("Logging configured with newest entries first.")
