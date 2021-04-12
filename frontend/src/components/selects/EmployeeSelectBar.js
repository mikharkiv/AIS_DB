import {makeAutoObservable} from "mobx";
import {AutoComplete} from "antd";
import {observer} from "mobx-react";
import {useMemo, useState, useEffect} from "react";
import {CardsAPI} from "../../api/CardsAPI";
import {EmployeesAPI} from "../../api/EmployeesAPI";

// TODO api
class EmployeeAutocompleteStore {
	variants = [];
	state = "idle";

	constructor() {
		makeAutoObservable(this);
	}

	*fetchVariants(query) {
		this.variants = [];
		this.state = "loading";
		yield EmployeesAPI.getEmployees({search: query}).then((r) => {
			this.variants = r;
		});
		this.state = "done";
	}

	onChange = (val) => {
		if (val && val.length >= 2) this.fetchVariants(val);
		else this.variants = [];
	}
}

const EmployeeAutocomplete = (props) => {
	const store = useMemo(() => new EmployeeAutocompleteStore(), []);
	const [localVal, setLocalVal] = useState(props.value ? {value: props.value.value, key: props.value.key} :
		{value: '', key: null});

	useEffect(() => props.onChange && props.value && props.value.key !== undefined && props.onChange(props.value.key),
		[props, props.value, props.onChange]);

	useEffect(() => {
		props.value && props.value.value && props.value.key !== undefined &&
		setLocalVal({value: props.value.value, key: props.value.key});
	},[props.value]);

	const onChange = (val) => {
		store.onChange(val);
		setLocalVal({value: val, key: null});
	}

	const onSelect = (val, option) => {
		setLocalVal({value: val, key: option.key});
		if (props.onChange) props.onChange(option.key);
		if (props.onSelect) props.onSelect(val, option);
	}

	return (
		<AutoComplete placeholder="Почніть писати, щоб побачити варіанти..."
		              onSelect={onSelect}
		              onChange={onChange}
		              value={localVal.value} >
			{ store.variants.map((e) => (
				<AutoComplete.Option key={e.id_employee} value={e.empl_name + ' ' + e.empl_surname}>
					{e.empl_name + ' ' + e.empl_surname}
				</AutoComplete.Option>
			))}
		</AutoComplete>
	);
}

export default observer(EmployeeAutocomplete);
