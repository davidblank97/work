<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="yes" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/Parameters/param[@id='202608']">
		<param id="202608">
			<name>AVC SENSE CONNECTOR SELECT</name>
			<short_name/>
			<desc>An IO point. Selects if AVC sense signal is coming through pipe head connector or sensor connector.</desc>
		</param>
	</xsl:template>
	<xsl:template match="/Parameters/param[@id='331269']">
		<xsl:copy-of select="."/>
		<param id="266645">
			<name>SESSION NO GAS FLOW DEVIATION</name>
			<short_name></short_name>
			<desc>No gas flow deviation that is not saved in the file and is only valid while the system is powered on.</desc>
		</param>
		<param id="331270">
			<name>SHIELD GAS SYMBOL</name>
			<short_name>SHIELD GAS</short_name>
			<desc>A setting that sets the symbol for the type of gas flowing through the shield gas sensor.</desc>
		</param>
		<param id="331271">
			<name>TRAIL GAS SYMBOL</name>
			<short_name>TRAIL GAS</short_name>
			<desc>A setting that sets the symbol for the type of gas flowing through the trail gas sensor.</desc>
		</param>
		<param id="331272">
			<name>PLASMA GAS SYMBOL</name>
			<short_name>PLASMA GAS</short_name>
			<desc>A setting that sets the symbol for the type of gas flowing through the plasma gas sensor.</desc>
		</param>
		<param id="331273">
			<name>BACKUP GAS SYMBOL</name>
			<short_name>BACKUP GAS</short_name>
			<desc>A setting that sets the symbol for the type of gas flowing through the backup gas sensor.</desc>
		</param>
	</xsl:template>
	
	<xsl:template match="/Parameters/param[@id='265032']">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/Parameters/param[@id='265034']"/>
			<xsl:otherwise>
				<param id="265034">
					<name>TRIM</name>
					<short_name></short_name>
					<desc>A weld parameter for the DIP process.</desc>
				</param>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="/Parameters/param[@id='206850']">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/Parameters/param[@id='264486']"/>
			<xsl:otherwise>
				<param id="264486">
					<name>INITIAL TRAVEL SPEED</name>
					<short_name></short_name>
					<desc>The speed that the travel axis will aim to be at while starting a weld. Once a weld is started and depending on slope time the axis will slope to the first enabled segment's travel speed.</desc>
				</param>
				<param id="264487">
					<name>INITIAL VOLTS</name>
					<short_name></short_name>
					<desc>Short for 'Initial Automatic Voltage Control'. The voltage the system will start with and depending on the slope time will slope to the primary/background voltage setpoints for first enabled segment.</desc>
				</param>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template match="/Parameters/param[@id='265730']/name">
		<name>MFC GAS FLOW LOW DEVIATION</name>
	</xsl:template>
	
	<xsl:template match="/Parameters/param[@id='265731']/name">
		<name>MFC NO GAS FLOW DEVIATION</name>
	</xsl:template>
	
	<xsl:template match="/Parameters/param[@id='264624']">
		<xsl:copy-of select="."/>
			<param id="264625">
				<name>WIRE MANIPULATOR UP/DOWN JOG</name>
				<short_name>JOG</short_name>
				<desc>The speed at which the wire manipulator axis will move while the operator is moving from one position to another. Jogging means positioning the axis while the system is not welding.</desc>
			</param>
			<param id="264626">
				<name>WIRE MANIPULATOR IN/OUT JOG</name>
				<short_name>JOG</short_name>
				<desc>The speed at which the wire manipulator axis will move while the operator is moving from one position to another. Jogging means positioning the axis while the system is not welding.</desc>
			</param>	
	</xsl:template>
	
	<xsl:template match="/Parameters/param[@id='264656']">
		<xsl:copy-of select="."/>
			<param id="264657">
				<name>WIRE MANIPULATOR UP/DOWN STEP</name>
				<short_name>STEP</short_name>
				<desc>The distance the torch will move along the ACC axis when the step function is used. A step function is when a user commands the robot to move a specified distance in a given direction, usually to make fine positions moves.</desc>
			</param>
			<param id="264658">
				<name>WIRE MANIPULATOR IN/OUT STEP</name>
				<short_name>STEP</short_name>
				<desc>The distance the torch will move along the ACC axis when the step function is used. A step function is when a user commands the robot to move a specified distance in a given direction, usually to make fine positions moves.</desc>
			</param>		
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>