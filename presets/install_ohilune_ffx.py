import os
import sys
import re
from pathlib import Path

def install_ffx():
    current_username = os.getlogin()
    current_path = Path(__file__).parent
    source_path = current_path / 'OHILUNE'
    destination_path = Path()

    user_adobe_path = Path(f'C:/Users/{current_username}/Documents/Adobe')

    adobe_version_paths = [
        folder for folder in user_adobe_path.iterdir()
        if folder.is_dir() and re.match(r'After Effects \d{4}$', folder.name)
    ]

    for version_path in adobe_version_paths:
        destination_path = version_path / 'User Presets' / 'OHILUNE'
        print(destination_path)
        try:
            if destination_path.exists():
                if destination_path.is_symlink() or destination_path.is_dir():
                    os.rmdir(destination_path)

            os.system(f'mklink /J "{destination_path}" "{source_path}"')
            print(f'Install OHILUNE FFX: {source_path} -> {destination_path}')
        except OSError as e:
            print(f"Install Error: {e}")


if __name__ == "__main__":
    install_ffx()
