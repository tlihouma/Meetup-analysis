This repo contains the code of my interactive data visualization : [Meetup analysis]
I used Python and Javascript (D3js, DC.js,Leaflet.js) to visualize and analyze Meetup.com data. We focused on tech groups in France, Belgium and Swiss.I analyzed:the geographical repartition of tech groups,the biggest groups, the number of new groups each year and the towns with the most number of groups

![](datavizmeetupanalysis.gif)

#Dependencies

You need ```Python``` 3 ```Python``` libraries: ```Pandas```, ```Flask```, ```Shapely```.

The easiest way to install all these librairies is to install them as part of the [Anaconda distribution](https://www.continuum.io/downloads).



#How to run the code

1. Install all Python dependencies
2. Download the dataset  from [Meetup.com](https://www.meetup.com/meetup_api/). You need an API key. You have to do as many queries as cities you are interested in . Here is an example:url='http://api.meetup.com/2/groups?&country=FR&category_id=34&city=paris&only=id,name,members,rating,topics,city&key=xxxxxxxxxxxxxxxxxxx'
3. Save the json files into the ```input``` folder.
4. Merge the json files
5. From the root folder, run ```python app.py```



