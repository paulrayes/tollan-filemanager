'use strict';

module.exports = function(tollan) {
	var React = tollan.React;

	var fileStore = tollan.getStore('filemanager/fileStore');

	return React.createClass({
		propTypes: {
			prefix: React.PropTypes.string.isRequired
		},
		getInitialState: function() {
			return this.getStateFromStores();
		},
		componentDidMount: function componentDidMount() {
			fileStore.on('change', this.onStoreChange);
		},
		componentWillUnmount: function componentWillUnmount() {
			fileStore.removeListener('change', this.onStoreChange);
		},
		onStoreChange: function onStoreChange() {
			this.setState(this.getStateFromStores());
		},
		getStateFromStores: function getStateFromStores() {
			return {
				files: fileStore.getFilesByPrefix(this.props.prefix)
			};
		},
		render: function render() {
			console.log(this.state.files);
			var files = [];
			this.state.files.forEach(file => {
				files.push(<li key={file.name}>{file.name}</li>);
			});
			return <div className="FileList">
				<ul>
					{files}
				</ul>
			</div>;
		}
	});
};
