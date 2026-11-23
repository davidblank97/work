<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />

	<!-- Add your XSL Transformations below this line -->
	<xsl:template match = "/Parameters/*[last()]">
		<xsl:copy-of select="."/>
			<param id="200227">
				<name>SHOULD RESPOND TO ALARMS FROM WIRE MANIPULATOR UP-DOWN</name>
				<short_name></short_name>
				<desc>A setting that allows the user to enable/disable the alarms from wire manipulator up-down axis.</desc>
			</param>
			<param id="200238">
				<name>SHOULD RESPOND TO ALARMS FROM WIRE MANIPULATOR IN-OUT</name>
				<short_name></short_name>
				<desc>A setting that allows the user to enable/disable the alarms from wire manipulator in-out axis.</desc>
			</param>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>