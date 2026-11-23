<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/language/text[@id='532']">
		<xsl:copy-of select="."/>
		<text id="533">
			<content>SERIAL</content>
			<desc>N/A</desc>
		</text>
		<text id="534">
			<content>PRESS HERE TO ENTER COMMAND</content>
			<desc>Refers to an instruction to a user to press/click the screen, to send a command to the computer</desc>
		</text>
	</xsl:template> 

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>