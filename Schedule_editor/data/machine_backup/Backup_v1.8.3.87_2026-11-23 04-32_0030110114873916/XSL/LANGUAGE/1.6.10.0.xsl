<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/language/text[@id='65597']">
		<xsl:copy-of select="."/>
		<text id="65598">
			<content>Enter the diameter where you are measuring the axis distance in the input field above.</content>
			<desc>Description of a step for calibrating a rotary axis.</desc>
		</text>
	</xsl:template>
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>