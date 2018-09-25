import { helloGRPC } from './service/greeter_client';
import { ExportToCsv } from 'export-to-csv';

var data = new Array();
var cc = [0,0,0,0,0,0,0];

function setData(id: number, iteration: number, concurrent: number, value: Array<string>) {
	data = data.concat(value);

	if (iteration < 20){
		helloGRPC("volume", id, setData, concurrent,iteration+1);
	} else {
		cc[concurrent] = cc[concurrent] + concurrent;
		if (Math.sqrt(cc[concurrent]) == concurrent){
			var filename = 'cc'+concurrent;
			const options = { 
			    fieldSeparator: ',',
			    quoteStrings: '"',
			    decimalseparator: '.',
			    useBom: true,
			    filename: filename
			  };
			const csvExporter = new ExportToCsv(options);
			csvExporter.generateCsv(data);

			data = new Array();
			console.log(concurrent, "cc done");
			/*
			cc[concurrent] = 0;
			var num:number = 1;
			while(num <= concurrent){
				helloGRPC("volume", num+10, setData, concurrent, 1);
				num++;
			}*/
			
			if (concurrent < 6){
				var new_cc = concurrent+1;
				var num:number = 1;
				while(num <= new_cc){
					helloGRPC("volume", num+10, setData, new_cc, 1);
					num++;
				}
			}
		}
		
	}
 }

helloGRPC("volume", 11, setData, 1, 1);


