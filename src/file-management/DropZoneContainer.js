import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import { FILE_LOADED_SUCCESS } from './types';
import DropZone from './DropZone';

const mapStateToProps = ({
  files,
  selectedFile,
}) => {
  const file = files.find(f => f.id === selectedFile) || {};

  return ({
    fileName: file.fileName,
    fileLastModifiedDate: file.fileLastModifiedDate,
    harJson: file.harJson,
  })
};

const mapDispatchToProps = dispatch => bindActionCreators({
  onFileLoaded: ({ fileName, fileLastModifiedDate, harJson }) => ({
    type: FILE_LOADED_SUCCESS,
    fileName,
    fileLastModifiedDate,
    harJson,
  }),
}, dispatch);

const DropZoneContainer = connect(mapStateToProps, mapDispatchToProps)(DropZone);

export default DropZoneContainer;
