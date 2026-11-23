<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/language/text[@id='1048606']">
		<xsl:copy-of select="."/>
		<text id="1048607">
			<content>Disconnect from AAO to login from the power supply.</content>
			<desc>Message text notifying the user that user must disconnect from the software application AAO before logging in from the power supply.</desc>
		</text>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>