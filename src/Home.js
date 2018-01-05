import React, { Component } from 'react';
import IngredientList from './ingredientList';

class Home extends Component {
  constructor(props){
    super(props);

    this.state = {
      recipies:  JSON.parse(localStorage.getItem('recipies')) || []
    };
    this.removeItem =this.removeItem.bind(this);

  }

  removeItem(resultsArray, i){
    console.log(" x button clicked", resultsArray[i].key);
    console.log("localStorage :",localStorage);
    //localStorage.removeItem(resultsArray[i].key);
    let delRecipies = [...this.state.recipies];
    delRecipies.splice(i,1);
    localStorage.setItem('recipies', JSON.stringify(delRecipies));
    this.setState({recipies: JSON.parse(localStorage.getItem('recipies'))})
  }

  displayRecipies() {
    let resultsArray = [];

    this.state.recipies.map((recipie, i) => {
      console.log(recipie.name);
      resultsArray.push(
        <div key={i} className="col-sm-6 col-md-4">
          <span>
            <div className="thumbnail">
              <img src={recipie.image} alt={recipie.name} />
                <div className="caption">
                  <h3>{recipie.name}</h3>
                  <p>{recipie.description}</p>
                  <IngredientList recipie={recipie} />
                  <button onClick={() => this.removeItem(resultsArray,i)} >x</button>
                </div>
            </div>
          </span>
        </div>
      );
    }
  );

  console.log('resultsArray', resultsArray);
    return resultsArray;
  }

  render(){
    return(
      <div className="row">
        <h2>Home</h2>
        {this.displayRecipies()}
      </div>
    );
  }
}

export default Home;
