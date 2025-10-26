"""
Main application entry point for Advanced Book Recommendation System v2.0
Features modular architecture with ML-powered recommendations
"""

import logging
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent))

import config
from ui.cli import CLI

# Setup logging
logging.basicConfig(
    level=getattr(logging, config.LOG_LEVEL),
    format=config.LOG_FORMAT,
    handlers=[
        logging.FileHandler(config.LOG_FILE),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)


def main():
    """Main application entry point"""
    try:
        logger.info("="*60)
        logger.info("Starting Advanced Book Recommendation System v2.0")
        logger.info("="*60)
        
        # Initialize and run CLI
        cli = CLI()
        cli.run()
        
        logger.info("Application shutdown complete")
        
    except KeyboardInterrupt:
        logger.info("Application interrupted by user")
        print("\n\nGoodbye! 👋")
    except Exception as e:
        logger.error(f"Fatal error: {e}", exc_info=True)
        print(f"\n❌ Fatal error: {e}")
        print("Check logs/app.log for details")
        sys.exit(1)


if __name__ == "__main__":
    main()
