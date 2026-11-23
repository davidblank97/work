<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />

	<!-- Add your XSL Transformations below this line -->
	<xsl:template match = "/Parameters/*[last()]">
		<xsl:copy-of select="."/>
		<param id="200239">
			<name>CAN LONG PRESS ON UI SCREEN LOCK WELD PARAMETERS</name>
			<short_name></short_name>
			<desc>A setting that allows the user to enable/disable the lock feature for weld run screen controls.</desc>
		</param>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>
</xsl:stylesheet>