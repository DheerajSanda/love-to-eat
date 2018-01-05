import React, { Component } from 'react';

import Dropzone from 'react-dropzone';
import request from 'superagent';

import Ingredients from './Ingredients';
import IngredientList from './ingredientList';

const CLOUDINARY_UPLOAD_PRESET = 'pcbuci5y';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dheeraj/image/upload';



class Submit extends Component {
  constructor(props){
    super(props);

    this.state = {
      recipies:  JSON.parse(localStorage.getItem('recipies')) || [],
      newRecipie:{
        name: "NewRecipie",
        description: "Description",
        ingredients: []
      },
      uploadedFileCloudinaryUrl: ''
    };
    this.submitRecipe = this.submitRecipe.bind(this);
    this.onImageDrop = this.onImageDrop.bind(this);
  }

  onImageDrop(files) {
    this.setState({
      uploadedFile: files[0]
    });

    this.handleImageUpload(files[0]);
  }

  handleImageUpload(file) {
    let upload = request.post(CLOUDINARY_UPLOAD_URL)
                        .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                        .field('file', file);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }

      if (response.body.secure_url !== '') {
        this.setState({
          uploadedFileCloudinaryUrl: response.body.secure_url
        });
      }
    });
  }

  submitRecipe(){
    console.log('Button clicked');
    console.log(this.name.value, this.description.value);
    let newRecipie = this.state.newRecipie;

    newRecipie.name = this.name.value;
    newRecipie.description = this.description.value;
    newRecipie.image = this.state.uploadedFileCloudinaryUrl;

    this.setState({newRecipie});

    let recipies = this.state.recipies;
    recipies.push(newRecipie);

    this.setState({recipies});
    localStorage.setItem('recipies', JSON.stringify(recipies));
    console.log(recipies);

    this.props.history.push('/');
  }

  addIngredient(quantity, ingredient){
    console.log("Add Ingredients in Submit js", quantity, ingredient);
    let newRecipie = this.state.newRecipie;
    newRecipie.ingredients.push({quantity: quantity, ingredient: ingredient});
    this.setState({newRecipie: newRecipie});
    console.log('submit.js',newRecipie);
  }

  render(){
    return(
      <div>
        <div className="row">
          <div className="col-xs-12 col-sm-12">
            <h1>Submit</h1>
              <form>
                <Dropzone
                  multiple={false}
                  accept="image/*"
                  onDrop={this.onImageDrop}>
                  <p>Drop an image or click to select a file to upload.</p>
                </Dropzone>
                <div>
                  {this.state.uploadedFileCloudinaryUrl === '' ? null :
                  <div>
                    <p>{this.state.uploadedFile.name}</p>
                    <img alt={this.state.uploadedFileCloudinaryUrl} src={this.state.uploadedFileCloudinaryUrl} />
                  </div>}
                </div>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text"
                    ref={(input) => {this.name = input;}}
                    className="form-control"
                    id="name"
                    placeholder="Enter the name of the recipie" />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea className="form-control"
                    id="description"
                    ref={(input) => {this.description = input;}}
                    placeholder="Enter a brief description" />
                </div>
                <IngredientList recipie={this.state.newRecipie}/>
                <Ingredients addIngredient={(quantity, ingredient) => {this.addIngredient(quantity, ingredient)}} />
                <button type="button" onClick={this.submitRecipe}>Submit a Recipe</button>
              </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Submit;
