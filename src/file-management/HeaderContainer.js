import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import { SELECT_FILE } from './types';
import Header from './Header';

const mapStateToProps = ({ files, selectedFile }) => {
  const file = files.find(f => f.id === selectedFile);

  return {
    files,
    selectedFileId: selectedFile,
    selectedFileName: file.fileName,
    selectedFileLastModifiedDate: file.fileLastModifiedDate,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  onSelectFile: (id) => ({
    type: SELECT_FILE,
    id,
  }),
}, dispatch);

const HeaderContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);

export default HeaderContainer;
