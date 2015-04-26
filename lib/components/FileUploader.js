'use strict';

module.exports = function(tollan) {
	var React = tollan.React;

	return React.createClass({
		propTypes: {
			prefix: React.PropTypes.string.isRequired
		},
		getInitialState: function() {
			return {
				dropzone: undefined
			};
		},
		componentDidMount: function componentDidMount() {
			tollan.loadBundle('dropzone').then(() => {
				var Dropzone = require('dropzone');
				var myDropzone = new Dropzone(document.body, {
					url: '/api/action/filemanager/upload',
					clickable: this.refs.dropzone.getDOMNode(),
					previewsContainer: this.refs.dropzone.getDOMNode(),
					thumbnailHeight: 96,
					thumbnailWidth: null,
					previewTemplate: `
						<div class="FileUploader">
							<div class="preview"><img data-dz-thumbnail /></div>
							<div class="meta">
								<p class="name" data-dz-name></p>
								<p class="size" data-dz-size></p>
								<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
									<div class="progressBar" style="width:0%;" data-dz-uploadprogress></div>
								</div>
								<strong class="error text-danger" data-dz-errormessage></strong>
							</div>
						</div>`
				});
				this.setState({
					dropzone: myDropzone
				});
				myDropzone.on('sending', (file, xhr, formData) => {
					// Will send the prefix along with the file as POST data.
					formData.append('prefix', this.props.prefix);
				});
			});
		},
		componentWillUnmount: function componentWillUnmount() {
			if (typeof this.state.dropzone !== 'undefined') {
				this.state.dropzone.destroy();
			}
		},
		render: function render() {
			return <div className="dropzone" ref="dropzone">
			</div>;
		}
	});
};
