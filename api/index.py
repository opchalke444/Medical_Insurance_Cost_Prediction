"""
Vercel Serverless Function Entrypoint
Provides seamless fallback resolution for standard Vercel serverless functions.
"""
import sys
import os

# Anchor root and backend directories to sys.path
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_dir = os.path.join(root_dir, "backend")

for path in [root_dir, backend_dir]:
    if path not in sys.path:
        sys.path.insert(0, path)

from backend.app.main import app

__all__ = ["app"]
