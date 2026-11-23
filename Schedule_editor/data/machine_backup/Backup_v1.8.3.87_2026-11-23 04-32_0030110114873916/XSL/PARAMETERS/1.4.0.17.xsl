<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="yes" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/Parameters">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<param id="264681">
				<name>OSC PRE POSITION</name>
				<short_name></short_name>
				<desc>The position that the OSC axis will move to before a weld has started. Used to automatically position the weld head.</desc>
			</param>
			<param id="264682">
				<name>THETA PRE POSITION</name>
				<short_name></short_name>
				<desc>The position that the THETA axis will move to before a weld has started. Used to automatically position the weld head.</desc>
			</param>
		</xsl:copy>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>