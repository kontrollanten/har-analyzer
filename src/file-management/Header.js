import { h } from 'preact';

import styles from './header.scss';

const preventDefault = cb => event => {
  event.preventDefault();
  cb();
};

const Header = ({
  files,
  selectedFileId,
  selectedFileName,
  selectedFileLastModifiedDate,
  onSelectFile,
}) => (
  <header className={styles.Header}>
    <ul className={styles.Menu}>
      {files.map(file => (
        <li
          className={[
            selectedFileId === file.id && styles.SelectedMenuItem,
            styles.MenuItem,
          ].filter(c => c).join(' ')}
        >
          <a href="#" onClick={preventDefault(() => onSelectFile(file.id))}>
            {file.fileName}
          </a>
        </li>
      ))}
    </ul>

    <div>
      <div>{selectedFileName}</div>
      <div>{selectedFileLastModifiedDate}</div>
    </div>
  </header>
);

export default Header;
