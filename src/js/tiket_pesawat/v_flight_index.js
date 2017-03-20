/* jshint ignore:start */
	class Popular extends React.Component {
		render() {

			var listing_as = this.props.listing_as;

			var airportRows = this.props.searchResults.map(function(result) {
				if(!result.popular){
					return;
				}

				return <AirportRow key={result.airport_code} city={result.airport_city} name={result.airport_name} code={result.airport_code} listing_as={listing_as} />
			});
			return(
				<div>
					<div className="mui-container padding-reset">
						<div className="search-flight font-semibold">
							Kota Populer
						</div>
						<div>
							{airportRows}
						</div>
					</div>
				</div>
			);
		}
	}

	class AirportRow extends React.Component {
		handleClick(code, city, listing_as) {

			if(listing_as == "DEPARTURE"){
				clickDepartureReact(code, city);
			}

			if(listing_as == "ARRIVAL"){
				clickArrivalReact(code, city);
			}

			clearFilterText = listing_as;
		}

		render() {
			return (
				<div
					className="mui-col-xs-12 airport-list sembunyikan-detail"
					onClick={ () => { this.handleClick(this.props.code, this.props.city, this.props.listing_as) } }
				>
					<p className="font-semibold">{this.props.city}</p>
					<p className="mui--text-caption">{this.props.name} ({this.props.code})</p>
				</div>
			);
		}
	}

	class History extends React.Component {
		render() {

			var listing_as = this.props.listing_as;

			var historyAirportCodes = this.props.history;

			var airportRows = this.props.searchResults.map(function(result) {

				var history_key = $.inArray( result.airport_code, historyAirportCodes );
				var history_available = (history_key != -1)? true : false;

				if(!history_available){
					return;
				}

				return <AirportRow key={result.airport_code} city={result.airport_city} name={result.airport_name} code={result.airport_code} listing_as={listing_as} />
			});
			return(
				<div>
					<div className="mui-container padding-reset">
						<div className="search-flight font-semibold">
							Pencarian Terakhir
						</div>
						<div>
							{airportRows}
						</div>
					</div>
					<div className="mui-divider">
					</div>
				</div>
			);
		}
	}

	class FilterableAirport extends React.Component {
		constructor(props) {
			super(props);

			var url = this.props.url;
			var url_history = this.props.url_history;
			var listing_as = this.props.listing_as;

			this.state = {
				filterText: '',
				url: url,
				url_history: url_history,
				listing_as: listing_as,
				airports: [],
				history: [],
			};

			this.handleUserInput = this.handleUserInput.bind(this);

		}

		componentDidMount() {
			this.loadAirportList();
			this.loadHistoryList();

			setInterval(this.clearText.bind(this), 500);
		}

		// refresh the current filtertext state
		clearText(){

			if(clearFilterText === this.props.listing_as){
				this.setState({
					filterText: '',
				});
				clearFilterText = false;
			}
		}

		handleUserInput(filterText) {

			this.setState({
			filterText: filterText,
			});
		}

		loadAirportList() {

			$.ajax({
				url: this.state.url,
				dataType: 'json',
				cache: false,
				success: function(data) {
					this.setState({airports: data});
				}.bind(this),
				error: function(xhr, status, err) {
					console.log(this.state.url, status, err.toString());
				}.bind(this)
			});
		}

		loadHistoryList() {

			$.ajax({
				url: this.state.url_history,
				dataType: 'json',
				cache: false,
				success: function(data) {
					if(data.history){
						var history = data.history.history;
						this.setState({history: history});
					}

				}.bind(this),
				error: function(xhr, status, err) {
					console.log(this.state.url, status, err.toString());
				}.bind(this)
			});
		}


		render() {

			if(this.state.filterText !== "") {
				var retSearchResult = <SearchResult searchResults={this.state.airports} filterText={this.state.filterText} listing_as={this.state.listing_as} />;
			}

			if(this.state.filterText == "" && this.state.history.length > 0) {
				var retHistory = <History history={this.state.history} searchResults={this.state.airports} listing_as={this.state.listing_as} />;
			}

			if(this.state.filterText == "") {
				var retPopular = <Popular searchResults={this.state.airports} listing_as={this.state.listing_as} />;
			}

			return (
				<div>
					<SearchBar
					filterText={this.state.filterText}
					onUserInput={this.handleUserInput}
					listing_as={this.state.listing_as}
					/>

					<div>
						<div className="mui-container mui--text-left flight-top-padding scrolling-div-flight">
							{retSearchResult}
							{retHistory}
							{retPopular}
						</div>
					</div>

				</div>
			);
		}
	}

	class SearchResult extends React.Component {
		render() {
			var rows = [];

			var searchResults = this.props.searchResults;
			var listing_as = this.props.listing_as;

			searchResults.forEach((result) => {

				var tagArray = result.tag;
				var tag = tagArray.join(" ");

				var name = result.airport_city + result.airport_name + result.airport_code + tag;
				var nametext = name.toLowerCase();
				var filtertext = this.props.filterText.toLowerCase();

				if (nametext.indexOf(filtertext) === -1) {
					return;
				}

				if(filtertext != ""){
					rows.push(<AirportRow key={result.airport_code}city={result.airport_city} name={result.airport_name} code={result.airport_code} listing_as={listing_as} />);
				}
			});

			var count_row = rows.length;

			if(count_row >= 1){
				var hasil_pencarian = "Hasil Pencarian";
			}

			if(count_row <= 0){
				var not_found = <NotFound />;
			}

			return (
				<div>
					<div className="mui-container padding-reset">
						<div className="search-flight font-semibold">
							{hasil_pencarian}
						</div>
						<div>
							{rows}
						</div>
						{not_found}
					</div>
				</div>
			);
		}
	}

	class NotFound extends React.Component {
		render() {
			return (
				<div className="mui-container mui--text-center not_found_airport">
					<div className="mui-col-xs-12 mui-col-md-12 flight-padding-top flight-padding-bottom ">
						<img src={img_not_found} width="25%" />
					</div>
					<div className="mui-col-xs-12 mui-col-md-12">
							<p className="ganti-tanggal-price">Bandara / kota tidak ditemukan</p>
							<p className="mui--text-caption">Mohon periksa pencarian Anda</p>
					</div>
				</div>
			);
		}
	}

	class SearchButton extends React.Component {

		clickClose(listing_as){
			clearFilterText = listing_as;
		}

		render() {
			if(this.props.close_button) {
				return (
						<button className="flight-close-icon close bottom-35 right-10 pos-rel" type="reset" onClick={ () => { this.clickClose(this.props.listing_as) } }>
							<i className="material-icons" type="reset">&#xE14C;</i>
						</button>
				);
			}
			else{
				return (
					<button className="flight-close-icon search">
						<i className="material-icons">&#xE8B6;</i>
					</button>
				);
			}
		}
	}

	class SearchBar extends React.Component {
		constructor(props) {
			super(props);
			this.handleChange = this.handleChange.bind(this);
		}

		handleChange() {
			this.props.onUserInput(
			this.filterTextInput.value
			);
		}

		toggleListing(listing_as){
			if(listing_as == "DEPARTURE"){
				this.toggleKotaAsal();
			}

			if(listing_as == "ARRIVAL"){
				this.toggleKotaTujuan();
			}

			clearFilterText = listing_as;
		}

		toggleKotaAsal() {
			toggleByClass("slide-div-bottom-kota-asal");
		}

		toggleKotaTujuan() {
			toggleByClass("slide-div-bottom-kota-tujuan");
		}

		render() {

			var show_close_button = (this.props.filterText != "") ? true: false;
			var button = <SearchButton close_button={show_close_button} listing_as={this.props.listing_as} />;

			return (
				<header className="flight-navbar mui-panel bg-white-flight">
					<div className="margin-reset mui-row">
						<div className="add-padding1 mui--appbar-height mui-col-xs-12 mui-col-md-12">
							<form className="navbar--search_form">
								<a className="clickable-thumbnail" onClick={ () => { this.toggleListing(this.props.listing_as) } } >
									<i className="material-icons back-search-flight">&#xE5C4;</i>
								</a>

								<input
									type="text"
									className="flight-search-box flight-search-bar mui--text-left"
									placeholder="Ketik nama Kota atau Bandara"
									value={this.props.filterText}
									ref={(input) => this.filterTextInput = input}
									onChange={this.handleChange}
								/>

								{button}
							</form>
						</div>
					</div>
				</header>
			);
		}
	}

	ReactDOM.render(
			<FilterableAirport url={airport_list_departure} url_history={ajax_search_history} listing_as="DEPARTURE" />,
			document.getElementById('content1')
	);

	ReactDOM.render(
			<FilterableAirport url={airport_list_departure} url_history={ajax_search_history} listing_as="ARRIVAL" />,
			document.getElementById('content2')
	);
/* jshint ignore:end */
