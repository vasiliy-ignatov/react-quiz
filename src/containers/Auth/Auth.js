import React, { Component } from 'react';
import './Auth.css';
import Button from '../../components/Ui/Button/Button';
import Input from '../../components/Ui/Input/Input';
import is from 'is_js';
import { connect } from 'react-redux';
import { auth } from '../../store/actions/auth';


class Auth extends Component {
	state = {
		isFormValid: false,
		formControls: {
			email: {
				value: '',
				type: 'email',
				label: 'Email',
				errorMessage: 'Введите корректный Email',
				valid: false,
				touched: false,
				validation: {
					required: true,
					email: true
				}
			},
			password: {
				value: '',
				type: 'password',
				label: 'Пароль',
				errorMessage: 'Введите корректный пароль',
				valid: false,
				touched: false,
				validation: {
					required: true,
					minLength: 6
				}
			}
		}
	}
	loginHandler = () => {
		console.log('login')
		this.props.auth(
			this.state.formControls.email.value,
			this.state.formControls.password.value,
			true
		)
	}
	registerHandler = () => {
		console.log('register')
		this.props.auth(
			this.state.formControls.email.value,
			this.state.formControls.password.value,
			false
		)
	}
	submitHandler = (event) => {
		event.preventDefault();
		console.log('submit')
	}
	validateControl(value, validation) {
		if (!validation) {
			return true;
		}

		let isValid = true;

		if (validation.required) {
			isValid = value.trim() !== '' && isValid;
		}

		if (validation.email) {
			isValid = is.email(value) && isValid;
		}

		if (validation.minLength) {
			isValid = value.length >= validation.minLength && isValid;
		}

		return isValid;
	}
	onChangeHandler = (evt, controlName) => {
		const formControls = { ...this.state.formControls };
		const control = { ...formControls[controlName] };

		control.value = evt.target.value;
		control.touched = true;
		control.valid = this.validateControl(control.value, control.validation);

		formControls[controlName] = control;

		let isFormValid = true;

		Object.keys(formControls).forEach(name => {
			isFormValid = formControls[name].valid && isFormValid;
		});

		this.setState({
			formControls,
			isFormValid
		})
	}
	renderInputs() {
		return Object.keys(this.state.formControls).map((controlName, index) => {
			const control = this.state.formControls[controlName];

			return (
				<Input
					key={controlName + index}
					type={control.type}
					value={control.value}
					valid={control.valid}
					touched={control.touched}
					label={control.label}
					errorMessage={control.errorMessage}
					shouldValidate={!!control.validation}
					onChange={(evt) => this.onChangeHandler(evt, controlName)}
				/>
			)
		});
	}
	render() {
		return (
			<div className="auth">
				<div>
					<h1>Авторизация</h1>
					<form onSubmit={this.submitHandler} className="auth-form">
						{this.renderInputs()}

						<Button
							type="success"
							onClick={this.loginHandler}
							disabled={!this.state.isFormValid}
						>
							Войти
						</Button>
						<Button
							type="primary"
							onClick={this.registerHandler}
							disabled={!this.state.isFormValid}
						>
							Зарегистрироваться
						</Button>
					</form>
				</div>
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return {
		auth: (email, password, isLogin) => dispatch(auth(email, password, isLogin))
	}
}

export default connect(null, mapDispatchToProps)(Auth);
