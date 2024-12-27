import subprocess
import sys
import os
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('script_execution.log')
    ]
)


def run_jsx_script(jsx_file_path):
    afterfx_path = r'C:\Program Files\Adobe\Adobe After Effects 2025\Support Files\AfterFX.com'

    command = f'"{afterfx_path}" -r "{jsx_file_path}"'
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)

        if result.returncode == 0:
            logging.info('Script executed successfully')
            logging.info('Output: %s', result.stdout)
        else:
            logging.error('An error occurred during script execution')
            logging.error('Error: %s', result.stderr)

    except FileNotFoundError:
        logging.error(f'After Effects path is incorrect: {afterfx_path}')
    except Exception as e:
        logging.exception('An unexpected error has occurred.')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        logging.error('Specify the JSX file path as an argument')
        sys.exit(1)

    jsx_file = sys.argv[1]

    if not os.path.isfile(jsx_file):
        logging.error(f'The specified JSX file cannot be found: {jsx_file}')
        sys.exit(1)

    run_jsx_script(jsx_file)
