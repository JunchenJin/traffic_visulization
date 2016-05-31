## Data meno traffic visualization platform
###Introduction
The web can be accessed at [link](http://ctr-32.infra.kth.se).
A modified version for the demo can be accessed at [localhost:8000/demo-od](http://localhost:8000/demo-od). 

### TODO:
- Currently the web project is coupled with database, we need to decouple the three apps from the web projects.
- Improve the code structure to decouple the chart plot with the map drawing.
- The resize and adjustment of plot with window remains to be improved.
- Improve the layout design, avoid modifying css for individual components

### Project structure
* mysite: configuration of the project
	* settings: database connection parameters, static files folder
	* urls.py: map url to framework/urls.py
* framework: core web content
	* urls.py: link url to request functions defined in views.py
	* views.py: link html response to request
	* **static**: static files for **CSS, JavaScript, Image**
		* base: shared files for all pages
			* js
			* CSS 
			* lib: shared library such as JQuery,Bootstrap
		* congestion: congestion app files
		* od: od app files
		* simulation: simulation app files
		* test: functions under development
			* ci: congestion index visualization app; not synchronized with the online version, some database functions need to be updated
	* **template**: templates for **html** files
		* **base.html: template of the web page, including *header,footer,js,css*,**
		* congestion.html (extend base)
		* od.html (extend base)
		* simulation.html (extend base)
		* test: pages under development
	* migrations: database migrations, not used in this project
	* pylib: integrating other python libraries into the project,e.g. matplotlib, **under development**



