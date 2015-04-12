package com.example.roulezjeuneve;


import com.example.roulezjeuneve.R;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;


public class MainActivity extends Activity implements OnClickListener{
	

	
	public String query;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		//initialize the edittext component
		EditText address = (EditText) findViewById(R.id.address);
		address.setOnClickListener(this);
		
		
		//initialize the search button to open browser
    	Button go = (Button) findViewById(R.id.go);
    	go.setOnClickListener(this);
		
	}

	
	@Override
	public void onClick(View v) {
		if(v.getId() == R.id.go){
			
			EditText address = (EditText) findViewById(R.id.address);
			query = address.getText().toString();
						
			String url = "http://mashups.unige.ch/2014-2015/olivier.glaus@bluewin.ch/OpenGeneva/itivelo.html"+"?adresse="+query;

			Log.d("name: ", url);
			
			/*InputMethodManager imm = (InputMethodManager)getSystemService(Context.INPUT_METHOD_SERVICE);
			imm.hideSoftInputFromWindow(address.getWindowToken(), 0);*/
			
			if(address.getText().toString().isEmpty()){ 

				AlertDialog alertDialog = new AlertDialog.Builder(this).create();
	    		alertDialog.setTitle("No address specified!");
	    		alertDialog.setMessage("Please specify an address before a search");

	    		
	    		alertDialog.setIcon(R.drawable.ic_launcher);
	    		alertDialog.show();
				
			}else{
			Uri webpage = Uri.parse(url);
			Intent intent = new Intent(Intent.ACTION_VIEW, webpage);
			Toast.makeText(this, "searching..", Toast.LENGTH_SHORT).show();
			if(intent.resolveActivity(getPackageManager()) != null) {
		        startActivity(intent);
				}
			}
		
		}
	
	}

}
