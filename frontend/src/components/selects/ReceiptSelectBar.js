import {makeAutoObservable} from "mobx";
import {AutoComplete} from "antd";
import {observer} from "mobx-react";
import {useMemo, useState, useEffect} from "react";
import {ReceiptsAPI} from "../../api/ReceiptsAPI";

// TODO api
class ReceiptAutocompleteStore {
	variants = [];
	state = "idle";

	constructor() {
		makeAutoObservable(this);
	}

	*fetchVariants(query) {
		this.variants = [];
		this.state = "loading";
		yield ReceiptsAPI.getReceipts({search: query}).then((r) => {
			this.variants = r;
		});
		this.state = "done";
	}

	onChange = (val) => {
		if (val && val.length >= 2) this.fetchVariants(val);
		else this.variants = [];
	}
}

const ReceiptAutocomplete = (props) => {
	const store = useMemo(() => new ReceiptAutocompleteStore(), []);
	const [localVal, setLocalVal] = useState(props.value ? {value: props.value.value, key: props.value.key} :
		{value: '', key: null});

	useEffect(() => props.onChange && props.value.key && props.onChange(props.value.key),
		[props, props.value, props.onChange]);

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
				<AutoComplete.Option key={e.check_number} value={e.check_number + ' ' + e.print_date}>
					{e.check_number + ' ' + e.print_date}
				</AutoComplete.Option>
			))}
		</AutoComplete>
	);
}

export default observer(ReceiptAutocomplete);
