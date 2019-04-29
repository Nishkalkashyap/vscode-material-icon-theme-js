type NAME_TO_ICON = { [name: string]: string };

import { FileExtensions1ToIcon } from './generated/FileExtensions1ToIcon';
import { FileExtensions2ToIcon } from './generated/FileExtensions2ToIcon';
import { FileNamesToIcon } from './generated/FileNamesToIcon';
import { FolderNamesToIcon } from './generated/FolderNamesToIcon';
import { LanguagesToIcon } from './generated/LanguagesToIcon';

export const DEFAULT_FOLDER = 'folder.svg';
export const DEFAULT_FOLDER_OPENED = 'folder-open.svg';
export const DEFAULT_ROOT = 'folder-root.svg';
export const DEFAULT_ROOT_OPENED = 'folder-root-open.svg';
export const DEFAULT_FILE = 'file.svg';

/**
 * Get icon for a folder
 * @param folderName name of folder to find icon for
 * @return icon filename
 */
export function getIconForFolder(folderName: string) {
    const folderIcon = FolderNamesToIcon[folderName];
    return folderIcon ? folderIcon : DEFAULT_FOLDER;
}

let prevExtension: undefined | string = undefined;
let prevIcon: undefined | string = undefined;

/**
 * Get icon for a file
 * @param fileName name of file to find icon for
 * @return icon filename
 */
export function getIconForFile(fileName: string) {
    // match by exact FileName
    const iconFromFileName = FileNamesToIcon[fileName];
    if (iconFromFileName !== undefined) {
        return iconFromFileName;
    }

    // match by File Extension
    const extensions = fileName.split('.');
    if (extensions.length > 2) {
        const ext1 = extensions.pop();
        const ext2 = extensions.pop();
        // check for `.js.map`, `test.tsx`, ...
        const iconFromExtension2 = FileExtensions2ToIcon[`${ext2}.${ext1}`];
        if (iconFromExtension2 !== undefined) {
            return iconFromExtension2;
        }
        // check for `.js`, `tsx`, ...
        if (!ext1) {
            // If there's no extension, return DEFAULT_ICON
            return DEFAULT_FILE;
        }
        if (ext1 === prevExtension) {
            return prevIcon;
        }
        const iconFromExtension1 = FileExtensions1ToIcon[ext1];
        if (iconFromExtension1 !== undefined) {
            // memoization
            prevExtension = ext1;
            prevIcon = iconFromExtension1;
            return iconFromExtension1;
        }
    } else {
        const ext = extensions.pop();
        if (!ext) {
            // If there's no extension, return DEFAULT_ICON
            return DEFAULT_FILE;
        }
        if (ext === prevExtension) {
            return prevIcon;
        }
        const iconFromExtension = FileExtensions1ToIcon[ext];
        if (iconFromExtension !== undefined) {
            // memoization
            prevExtension = ext;
            prevIcon = iconFromExtension;
            return iconFromExtension;
        }
    }

    // match by language
    const fileExtension = fileName.split('.').pop();
    if (fileExtension !== undefined) {
        const iconFromLang = LanguagesToIcon[fileExtension];
        if (iconFromLang) {
            return iconFromLang;
        }
    }

    // if there's no icon for file, use default one
    return DEFAULT_FILE;
}

/**
 * Get icon for an opened folder
 * @param folderName name of opened folder to icon for
 * @return icon filename
 */
export function getIconForOpenFolder(folderName: string) {
    return (
        getIconForFolder(folderName)
            .split('.')
            .shift() + '-open.svg'
    );
}
