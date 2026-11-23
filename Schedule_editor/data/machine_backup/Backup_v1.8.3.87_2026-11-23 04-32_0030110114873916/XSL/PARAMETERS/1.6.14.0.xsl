<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match = "/Parameters/param[@id='268298']">
		<xsl:copy-of select="."/>
		<param id="202707">
			<name>WIRE MANIPULATOR SIDE SWITCH SERVO</name>
			<short_name></short_name>
			<desc>An IO point. Allows to switch power for manipulator servos between the two sides.</desc>
		</param>
		<param id="202708">
			<name>EXTERNAL BEEPER</name>
			<short_name/>
			<desc>An IO point. Turns ON/OFF an audible beeping noise on external devices.</desc>
		</param>
	</xsl:template>
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>