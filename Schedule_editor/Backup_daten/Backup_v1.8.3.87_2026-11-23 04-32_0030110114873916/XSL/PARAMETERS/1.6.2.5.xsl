<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/Parameters/param[@id='200237']">
		<xsl:copy-of select="."/>
		<param id="200457">
			<name>ACCESS LOGS</name>
			<short_name></short_name>
			<desc>A user permission allowing a user to access log files.</desc>
		</param>
		<param id="200458">
			<name>ACCESS SETTINGS</name>
			<short_name></short_name>
			<desc>A user permission allowing a user to access settings.</desc>
		</param>
		<param id="200459">
			<name>EDIT SCHEDULES</name>
			<short_name></short_name>
			<desc>A user permission allowing a user to edit schedules.</desc>
		</param>
		<param id="200460">
			<name>RUN WELD</name>
			<short_name></short_name>
			<desc>A user permission allowing a user to run a weld.</desc>
		</param>
		<param id="200461">
			<name>ACCESS CALIBRATION</name>
			<short_name></short_name>
			<desc>A user permission allowing a user to calibrate the system.</desc>
		</param>
		<param id="200462">
			<name>ACCESS TEST</name>
			<short_name></short_name>
			<desc>A user permission allowing a user to access the test area on the system.</desc>
		</param>
		<param id="200463">
			<name>RUN AUTO SCHEDULE SELECTION</name>
			<short_name></short_name>
			<desc>A user permission allowing a user to run auto schedule selection.</desc>
		</param>
		<param id="200467">
			<name>SHOW ADVANCED MIG PARAMETERS</name>
			<short_name></short_name>
			<desc>A user permission allowing a user to view advanced MIG parameters.</desc>
		</param>
		<param id="200470">
			<name>ACCESS DIAGNOSTIC</name>
			<short_name></short_name>
			<desc>A user permission allowing a user to access diagnostic.</desc>
		</param>
		<param id="200471">
			<name>ACCESS PID TUNER</name>
			<short_name></short_name>
			<desc>A user permission allowing a user to use the PID Tuner.</desc>
		</param>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>