<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/Parameters/param[@id='264485']">
		<xsl:copy-of select="."/>
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
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>