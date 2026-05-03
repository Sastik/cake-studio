from setuptools import setup, find_packages

setup(
    name="cakeweb-common",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "pydantic",
        "redis",
        "setuptools"
    ],
)