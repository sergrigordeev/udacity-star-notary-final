import React from "react";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";

import FormHelperText from "@material-ui/core/FormHelperText";

import { withStyles } from "@material-ui/core/styles";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import InfoDialog from "./InfoDialog";


const styles = theme => ({
  cssLabel: {
    color: "white"
  },
  cssUnderline: {
    "&:after": {
      borderBottomColor: "white"
    }
  },
  cssFocused: {}
});

class AddStarForm extends React.Component {
  state = {
    data: { starName: "", starId: 0 }
  };
  starNameRef = React.createRef();
  idRef = React.createRef();
  dialog = React.createRef();

  handleValue = event => {
    const { data } = this.state;
    data[event.target.name] = event.target.value;
    this.setState({ data });
  };

  handleBlur = event => {
    const { name, value } = event.target;
    if (name === "starName") {
      // set true as second parameter to onBlur required validation
      this.starNameRef.current.validate(value);
    }

    if (name === "starId") {
      // set true as second parameter to onBlur required validation
      this.idRef.current.validate(value);
    }
  };
  showInfo = (title, desc) => {
    this.dialog.current.handleClickOpen(title, desc);
  }
  handleSubmit = (event) => {
    event.preventDefault();
    try {
      window.Client.createStar(this.state.data.starName, this.state.data.starId)
        .then(resp => {
          this.showInfo('Result', resp.description);
        })
        .catch(resp => {
          console.log(resp);
          this.showInfo('Result', resp.description);
        });

    } catch (e) {
      console.log(e);
      this.showInfo('Error', "Can't create the star");
    }
    let data = { starName: '', starId: '' };
    this.setState({ data });
  };
  render() {
    const { classes } = this.props;

    const { data } = this.state;
    return (
      <ValidatorForm
        onSubmit={this.handleSubmit}
        instantValidate={false}
      >
        <div>
          <FormControl>
            <TextValidator
              ref={this.starNameRef}
              name="starName"
              label="Star name"
              value={data.starName}
              onBlur={this.handleBlur}
              onChange={this.handleValue}
              validators={["required"]}
              errorMessages={["star name is required"]}
            />

            <FormHelperText id="star-name-text">Enter your star name.</FormHelperText>
          </FormControl>
        </div>
        <div>
          <FormControl>
            <TextValidator
              ref={this.idRef}
              name="starId"
              label="Star id"
              value={data.starId}
              onBlur={this.handleBlur}
              onChange={this.handleValue}
              validators={["required", 'minNumber:0']}
              errorMessages={["star id is required", "Id should be positive integer"]}
            />
            <FormHelperText id="star-id-text">This is positive integer.</FormHelperText>
          </FormControl>
        </div>

        <Button type="submit" color="primary" variant="contained">Create Star</Button>
        <InfoDialog ref={this.dialog} />
      </ValidatorForm>
    );
  }
}

export default withStyles(styles)(AddStarForm);